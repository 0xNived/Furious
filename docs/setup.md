# Setup Guide

## Requirements

- Node.js 18+
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- A server to test in

## Installation

```bash
git clone https://github.com/0xNived/Furious.git
cd Furious
npm install
```

## Configuration

Copy the example env file and add your token:

```bash
cp .env.example .env
```

```env
BOT_TOKEN=your_token_here
```

## Running

```bash
npm run dev
```

The bot should come online in your server. If it doesn't, check the console for errors.
