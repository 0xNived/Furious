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

<!-- Add more env vars here as you build features -->
