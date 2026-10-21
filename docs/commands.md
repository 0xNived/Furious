# Commands

> **Status:** Furious is in active development. The commands below are the planned moderation interface; they are not all available yet. A command is marked as available only after it is implemented and released.

## Command design

- Every moderator action requires a reason.
- Furious checks the moderator's Discord permission and role hierarchy before taking action.
- Every staff action creates a case record with the moderator, member, reason, date, and duration where relevant.
- If an action can be reversed, its companion command is released with it.

## First release

| Command | Usage | What it does | Permission |
| --- | --- | --- | --- |
| `/warn` | `/warn member reason` | Records a formal warning for a member. | Moderate Members |
| `/warnings` | `/warnings member` | Lists a member's active warnings. | Moderate Members |
| `/clear-warning` | `/clear-warning warning-id` | Removes one warning that was recorded by mistake. | Moderate Members |
| `/help` | `/help` | Explains Furious commands and required permissions. | None |

## Next: moderation actions

| Command | Usage | What it does | Permission |
| --- | --- | --- | --- |
| `/timeout` | `/timeout member duration reason` | Temporarily prevents a member from chatting or reacting. | Moderate Members |
| `/untimeout` | `/untimeout member reason` | Ends a member's active timeout early. | Moderate Members |
| `/kick` | `/kick member reason` | Removes a member who may rejoin later with an invite. | Kick Members |
| `/ban` | `/ban member reason` | Removes a member and prevents them from rejoining. | Ban Members |
| `/unban` | `/unban user-id reason` | Allows a banned user to join again. | Ban Members |
| `/case` | `/case case-id` | Shows one moderation case. | Moderate Members |
| `/cases` | `/cases member` | Shows a member's moderation history. | Moderate Members |

## Later: channel and staff tools

| Command | Usage | What it does | Permission |
| --- | --- | --- | --- |
| `/lock` | `/lock channel reason` | Stops normal members from sending messages in one channel. | Manage Channels |
| `/unlock` | `/unlock channel reason` | Reopens a channel previously locked by staff. | Manage Channels |
| `/slowmode set` | `/slowmode set channel duration` | Sets a delay between messages in a channel. | Manage Channels |
| `/slowmode off` | `/slowmode off channel` | Removes a channel's message delay. | Manage Channels |
| `/note` | `/note member text` | Adds a private staff note without punishing the member. | Moderate Members |
| `/clear-note` | `/clear-note note-id` | Removes an incorrect staff note. | Moderate Members |
| `/reason` | `/reason case-id text` | Adds or corrects a reason on an existing case. | Moderate Members |
| `/report` | `/report member reason` | Lets a member send a report to the moderation team. | None |
| `/report resolve` | `/report resolve report-id note` | Marks a report as handled and records the outcome. | Moderate Members |
| `/purge` | `/purge amount` | Deletes a small, recent group of messages. This cannot be undone. | Manage Messages |

## Important behaviour

- `/ban` always has `/unban`.
- `/timeout` always has `/untimeout`.
- `/lock` always has `/unlock`.
- `/warn` always has `/clear-warning`.
- `/purge` cannot restore deleted messages, so Furious will require confirmation for larger deletions.
- For text moderation, Furious uses Discord's native `/timeout` concept instead of an unclear `/mute` command. Voice actions may be added separately later.

## Need help?

Use `/help` in a server once Furious is available, or read the [setup guide](setup.md).
