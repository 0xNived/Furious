<div align="center">
  <h1>Onion</h1>
  <p>A focused Discord bot for safer, better-managed communities.</p>
  <p>
    <img src="https://img.shields.io/badge/status-active%20development-7c3aed?style=flat-square" alt="Status: active development">
    <img src="https://img.shields.io/badge/Node.js-18%2B-3c873a?style=flat-square" alt="Node.js 18 or newer">
    <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square" alt="discord.js v14">
  </p>
</div>

---

## What is Onion?

Onion is a Discord bot project for community moderation, security, and useful server tools. It is being built as one clear place for the features a server needs to stay organised and protected.

The project is in active development. Features listed below describe the direction of the bot, not a promise that every feature is already available.

## Direction

Onion will focus on a small set of practical areas:

- **Moderation** — tools for handling harmful or disruptive behaviour.
- **Security** — protection and controls for server administration.
- **Utility** — simple commands that make everyday server work easier.
- **Configuration** — settings that let each server choose how the bot behaves.

## Get started

### Requirements

- Node.js 18 or newer
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Install

```bash
git clone https://github.com/0xNived/Onion-Bot.git Onion
cd Onion
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Add your Discord bot token to `.env`:

```env
BOT_TOKEN=your_token_here
```

Start the bot in development mode:

```bash
npm run dev
```

## Commands and configuration

The command list and setup notes will grow with the bot:

- [Setup guide](docs/setup.md)
- [Commands](docs/commands.md)
- [Configuration](docs/configuration.md)

## Contributing

Keep changes focused, test them where possible, and use clear conventional commit messages.

## License

ISC
