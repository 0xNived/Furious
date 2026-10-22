# Configuration

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_TOKEN` | Yes | Discord bot token |
| `CLIENT_ID` | Yes for `npm run deploy` | Discord application ID |
| `GUILD_ID` | No | Development server ID; registers commands there immediately |
| `COMMAND_PREFIX` | No | Main prefix for message commands; defaults to `!` (`,` is also supported) |
| `DATABASE_URL` | No, until database features are added | PostgreSQL connection URL; keep the real value in `.env` only |

Prefix commands need the **Message Content Intent** enabled in the Discord Developer Portal.

Invite tracking also needs the **Server Members Intent** enabled in the Discord Developer Portal. The bot needs **Manage Server** to read invite use counts and **View Channel** plus **Send Messages** in the configured invite-log channel.

## Database

After setting `DATABASE_URL`, create and apply the database tables once:

```powershell
npm run db:generate
npm run db:migrate
```

Run `npm run db:generate` whenever a schema changes. Commit the generated `drizzle/` migration files. Run `npm run db:migrate` during deployment, not every time the bot starts.

For local PostgreSQL, use `postgresql://USER:PASSWORD@localhost:5432/onion`. Hosted providers may require an SSL option; use the connection URL supplied by that provider.

## Docker

Docker runs Onion in the same Node.js environment on every machine. It does not include secrets: keep them in your local `.env` file.

Build the image from the project folder:

```powershell
docker build --tag onion-bot .
```

Apply migrations once for each deployment, then register slash commands when they change:

```powershell
docker run --rm --env-file .env onion-bot npm run db:migrate
docker run --rm --env-file .env onion-bot npm run deploy
```

Start the bot in the background and restart it automatically after a machine restart:

```powershell
docker run --detach --name onion --restart unless-stopped --env-file .env onion-bot
```

To update, stop and remove the old container, pull the latest code, rebuild the image, run the migration command, then start it again. If PostgreSQL runs directly on your Windows machine, use `host.docker.internal` instead of `localhost` in `DATABASE_URL`; `localhost` inside the container means the container itself.
