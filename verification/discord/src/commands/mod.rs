use std::env;

use poise::serenity_prelude::{Color, CreateEmbed};
use serde::{Deserialize, Serialize};

use crate::{Context, Error};

#[derive(Serialize)]
struct VerificationRequest {
	code: String,
	username: String,
	uuid: String,
	verify: &'static str,
}

#[derive(Deserialize)]
struct VerificationResponse {
	success: bool,
	message: String,
}

#[poise::command(slash_command, aliases("link"))]
pub async fn verify(
	ctx: Context<'_>,
	#[description = "Skriv koden du har fået af hjemmesiden"] code: String,
) -> Result<(), Error> {
	let author = ctx.author();
	let mut embed = CreateEmbed::new()
		.title(format!("Link af konto {}", author.name))
		.color(Color::RED);

	if code.parse::<u32>().is_err() || code.len() != 6 {
		embed = embed.description("Din kode er invalid.");
		ctx.send(poise::CreateReply::default()
			.embed(embed)
			.ephemeral(true)
		).await?;
		return Ok(());
	}

	ctx.defer().await?;
	let url = format!("{}/api/verify/code", env::var("BASE_URL").unwrap_or(String::from("http://localhost:3000")));
	let client = reqwest::Client::new();

	let body = VerificationRequest {
		code,
		username: author.name.clone(),
		uuid: author.id.get().to_string(),
		verify: "Discord",
	};

	let res = client.put(url)
		.bearer_auth(env::var("OTP_VERIFICATION_TOKEN").expect("Expected OTP_VERIFICATION_TOKEN to be present."))
		.json(&body)
		.send().await.expect("Unable to send HTTP request.");

	let res = res.json::<VerificationResponse>().await.unwrap_or(
			VerificationResponse {
				success: false,
				message: String::from("Der opstod en fejl. Svaret fra forummet kunne ikke indlæses."),
			}
		);

	if !res.success {
		embed = embed.description(res.message);
		ctx.send(poise::CreateReply::default()
			.embed(embed)
			.ephemeral(true)
		).await?;
		return Ok(());
	}

	embed = embed.description("Du har tilsluttet din discord-konto til forummet!").color(Color::DARK_GREEN);

	ctx.send(poise::CreateReply::default()
		.embed(embed)
		.ephemeral(true)
	).await?;

	Ok(())
}