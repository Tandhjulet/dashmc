import { auth } from "@/auth";
import { client } from "@/lib/redis";
import { prisma } from "@/prisma/prisma";
import { revalidateTag } from "next/cache";

export interface OTPCode {
	email: string;
	code: string;
	forAccount: string;
	hasBeenVerified: boolean;
	uuid?: string;
}

// Generate OTP Code
export async function POST(req: Request) {
	const { username, verify } = await req.json();

	if(verify !== "Minecraft" && verify !== "Discord") {
		return Response.json(
			{success: false},
			{
				status: 400,
			}
		);
	}

	const session = await auth();
	if(!session?.user || !session.user.email) {
		return Response.json(
			{success: false},
			{
				status: 401,
			}
		)
	}

	// Generate a unique code
	let code: string;
	do {
		code = Math.floor(Math.random()*(10**6)).toString().padStart(6, "0");
	} while(await client.get(`otp-${verify}:${code}`));

	const res: OTPCode = {
		email: session.user.email,
		code,
		forAccount: username,
		hasBeenVerified: false,
	}

	// Save the OTP to redis with an expiry of 10 minutes
	await client.setEx(`otp-${verify}:${code}`, 600, JSON.stringify(res));

	return Response.json(res)
}

// Check if code is verified
export async function PATCH(req: Request) {
	const { code, verify }: {
		code: string;
		verify: "Minecraft" | "Discord";
	} = await req.json();

	if(verify !== "Minecraft" && verify !== "Discord") {
		return Response.json(
			{
				success: false,
				message: "Ukendt verifikationstype"
			}, { status: 400 }
		);
	}

	const session = await auth();
	if(!session?.user || !session?.user.email) {
		return Response.json(
			{
				success: false,
				message: "Du er ikke logget ind."
			}, { status: 401 }
		)
	}

	if(code.length !== 6) {
		return Response.json(
			{
				success: false,
				message: "Ugyldig kode."
			},
			{ status: 400 }
		)
	}

	const result = await client.get(`otp-${verify}:${code}`);

	let parsed: OTPCode & {exists: true} | {exists: false};
	if(result)
		parsed = {
			...JSON.parse(result),
			exists: true
		};
	else
		parsed = {exists: false};

	// The user has verified the account and fetched the
	// current status. Let's persist it.
	if(parsed.exists && parsed.hasBeenVerified) {
		// Verify that the user whom created the token is also the one
		// trying to 'claim' it
		if(session.user.email !== parsed.email)
			return Response.json({
					success: false,
					message: "Denne kode er ikke genereret til dig."
				}, { status: 401 });

		if(verify === "Minecraft") {
			await prisma.user.create({
				data: {
					email: parsed.email,
					username: parsed.forAccount,
					gameUUID: parsed.uuid!,

					// session is safe since we validated against the email earlier
					discordId: session.user.discordId,
				}
			})
		} else if(verify === "Discord" && !session.user.discordId) {
			await prisma.user.update({
				where: {
					email: parsed.email
				},
				data: {
					discordId: parsed.uuid!,
				}
			})
			revalidateTag(`user:${session.user.dbId}`);
		}
	}

	return Response.json({
		...parsed,
		success: true,
		message: "Du er blevet verificeret."
	})
}

// Verify code
// This is insecure by nature. Luckily, this is protected by our middleware
// using a shared, trusted token between minecraft server and website
export async function PUT(req: Request) {
	const { code, username, uuid, verify } = await req.json();
	
	const result = await client.get(`otp-${verify}:${code}`);

	if(!result)
		return Response.json({
			success: false,
			message: `Koden er invalid for ${verify}-verifikation.`
		})

	const parsed: OTPCode = JSON.parse(result);
	if(parsed.forAccount !== username && verify == "Minecraft")
		return Response.json({
			success: false,
			message: "Koden er genereret for en anden konto."
		})

	const updated = JSON.stringify({
		...parsed,
		uuid,
		hasBeenVerified: true,
	})
	await client.set(`otp-${verify}:${code}`, updated, {
		KEEPTTL: true
	})

	return Response.json({
		success: true,
		message: "Koden er verificeret."
	})
}