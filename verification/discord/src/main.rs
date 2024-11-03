use std::env;
use std::path::Path;

use poise::serenity_prelude::{ClientBuilder, GatewayIntents};

type Error = Box<dyn std::error::Error + Send + Sync>;
type Context<'a> = poise::Context<'a, Data, Error>;

mod commands;

pub struct Data {
}

async fn on_error(error: poise::FrameworkError<'_, Data, Error>) {
    match error {
        poise::FrameworkError::Setup { error, .. } => panic!("Failed to start bot: {:?}", error),
        poise::FrameworkError::Command { error, ctx, .. } => {
            println!("Error in command `{}`: {:?}", ctx.command().name, error,);
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                println!("Error while handling error: {}", e)
            }
        }
    }
}

#[tokio::main]
async fn main() {
	dotenvy::from_path_override(Path::new("../../.env")).expect("Could not load environment variables");

	let options = poise::FrameworkOptions {
		commands: vec![commands::verify()],
		on_error: |error| Box::pin(on_error(error)),
		..Default::default()
	};

	let framework = poise::Framework::builder()
        .setup(move |ctx, _ready, framework| {
            Box::pin(async move {
                println!("Logged in as {}", _ready.user.name);
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
				
                Ok(Data {
				})
            })
        })
        .options(options)
        .build();

	let token = env::var("AUTH_DISCORD_TOKEN").expect("AUTH_DISCORD_TOKEN not present in .env file!");
	let intents = GatewayIntents::MESSAGE_CONTENT;

	let client = ClientBuilder::new(token, intents)
		.framework(framework)
		.await;

	client.unwrap().start().await.unwrap();
}