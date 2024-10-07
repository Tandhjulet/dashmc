import { auth } from "@/auth";
import { client } from "@/lib/redis";
import { prisma } from "@/prisma/prisma";

export interface OTPCode {
	code: string;
	forAccount: string;
	hasBeenVerified: boolean;
	uuid?: string;
}

// Generate OTP Code
export async function POST(req: Request) {
	const { username } = await req.json();

	// Generate a unique code
	let code: string;
	do {
		code = Math.floor(Math.random()*(10**6)).toString().padStart(6, "0");
	} while(await client.get(`otp:${code}`));

	const res: OTPCode = {
		code,
		forAccount: username,
		hasBeenVerified: false,
	}

	// Save the OTP to redis with an expiry of 10 minutes
	await client.setEx(`otp:${code}`, 600, JSON.stringify(res));

	return Response.json(res)
}

// Check if code is verified
export async function PATCH(req: Request) {
	const { code } = await req.json();

	const result = await client.get(`otp:${code}`);

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
		const session = await auth();
		if(!session?.user)
			return;
		if(!session?.user.email)
			throw new Error("Email not present");

		await prisma.user.create({
			data: {
				email: session.user.email,
				username: parsed.forAccount,
				gameUUID: parsed.uuid!,
			}
		})
	}

	return Response.json(parsed)
}

// Verify code
// This is insecure by nature. Luckily, this is protected by our middleware
// using a shared, trusted token between minecraft server and website
export async function PUT(req: Request) {
	const { code, username, uuid } = await req.json();
	
	const result = await client.get(`otp:${code}`);

	if(!result)
		return Response.json({ success: false })

	const parsed: OTPCode = JSON.parse(result);
	if(parsed.forAccount !== username)
		return Response.json({ success: false })

	const updated = JSON.stringify({
		...parsed,
		uuid,
		hasBeenVerified: true,
	})
	await client.set(`otp:${code}`, updated, {
		KEEPTTL: true
	})

	return Response.json({
		success: true,
	})
}