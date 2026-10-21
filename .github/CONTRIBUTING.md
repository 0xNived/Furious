# Contributing to Furious

First off, thanks for considering contributing to Furious! 🎉 Every contribution helps make this bot better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Reporting Bugs](#reporting-bugs)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

## How Can I Contribute?

### 🐛 Reporting Bugs
- Use the [Bug Report](https://github.com/0xNived/Furious/issues/new?template=bug_report.yml) issue template.
- Include as much detail as possible: steps to reproduce, expected vs actual behavior, logs, and your environment.

### ✨ Suggesting Features
- Use the [Feature Request](https://github.com/0xNived/Furious/issues/new?template=feature_request.yml) template.
- Explain the problem your feature solves and why it benefits Furious users.

### 🔧 Submitting Code
1. Fork the repository.
2. Create a feature branch from `main`: `git checkout -b feature/my-feature`
3. Make your changes and commit with clear, descriptive messages.
4. Push to your fork and open a Pull Request.

## Development Setup

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/Furious.git
cd Furious

# 2. Install dependencies
npm install

# 3. Copy the example environment file and fill in your bot token
cp .env.example .env

# 4. Run the bot in development mode
npm run dev
```

> **Note:** You'll need a Discord bot token and a test server to develop against. Never commit your `.env` file or bot token.

## Pull Request Process

1. Ensure your code compiles/runs without errors.
2. Test your changes on a Discord test server.
3. Update documentation if your changes affect commands, configuration, or behavior.
4. Fill out the PR template completely.
5. Request a review from a maintainer.
6. PRs require at least one approving review before merge.

## Style Guidelines

- Write clear, self-documenting code with comments where the *why* isn't obvious.
- Keep commits atomic — one logical change per commit.
- Use descriptive branch names: `fix/ban-command-crash`, `feature/auto-mod-spam-filter`.
- Follow the existing code patterns and naming conventions in the project.

## Reporting Bugs

When reporting bugs, please include:
- Bot version or commit hash
- Node.js version (`node -v`)
- Hosting environment (local, Docker, VPS, etc.)
- Full error logs (redact any tokens or secrets!)

---

Thank you for helping make Furious better! 💪
