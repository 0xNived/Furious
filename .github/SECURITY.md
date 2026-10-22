# Security Policy

## Reporting a Vulnerability

**⚠️ Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Onion, please report it responsibly:

1. **Email:** Send details to `onion@nived.dev`.
2. **GitHub Security Advisories:** Use [private vulnerability reporting](https://github.com/0xNived/Onion-Bot/security/advisories/new).

### What to Include

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact (e.g., privilege escalation, data leak, bot token exposure)
- Any suggested fixes, if you have them

### Response Timeline

- **Acknowledgment:** Within 48 hours of your report
- **Assessment:** Within 1 week
- **Fix & Disclosure:** We aim to patch critical vulnerabilities within 2 weeks

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| Older   | ❌        |

## Security Best Practices for Self-Hosters

- **Never** commit your `.env` file or bot token to version control.
- Use environment variables or a secrets manager for sensitive configuration.
- Keep your Node.js runtime and dependencies up to date.
- Restrict bot permissions to only what is necessary in your Discord server.
- Regularly rotate your bot token if you suspect it has been compromised.

## Scope

This policy covers the Onion Discord bot codebase. It does **not** cover:
- Third-party dependencies (report those to their respective maintainers)
- Your own server configuration or hosting environment
- Discord platform vulnerabilities (report those to [Discord](https://discord.com/security))
