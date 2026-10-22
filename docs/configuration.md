# Configuration

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_TOKEN` | Yes | Discord bot token |
| `CLIENT_ID` | Yes for `npm run deploy` | Discord application ID |
| `GUILD_ID` | No | Development server ID; registers commands there immediately |
| `COMMAND_PREFIX` | No | Prefix for message commands; defaults to `!` |
| `DATABASE_URL` | No, until database features are added | PostgreSQL connection URL; keep the real value in `.env` only |

Prefix commands need the **Message Content Intent** enabled in the Discord Developer Portal.

<!-- Add more env vars here as you build features -->
