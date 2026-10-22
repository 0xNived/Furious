# Commands

## Utility

| Command | Description | Permission |
| --- | --- | --- |
| `/ping` or `!ping` | Checks whether Onion is online and shows global and personal ping totals. | Everyone |
| `/level [member]` or `!level [@member]` | Shows server experience, level progress, and rank. | Everyone |
| `/snipe`, `!snipe`, or `,snipe` | Shows the latest deleted message from this channel within 30 seconds. | Everyone |
| `/snipelist`, `!snipelist`, or `,snipelist` | Shows your 10 most recent snipes privately. | Everyone |
| `/invites me` or `,invites` | Shows your invite totals for this server. | Everyone |
| `/invites log #channel` or `,invites log #channel` | Sets the channel for invite join logs. | Manage Server |
| `/inviter member:@member` or `,inviter @member` | Shows who invited a member, when Onion has tracked their join. | Everyone |
| `/kick member:@member reason:text` or `,kick @member reason` | Removes a member from the server. | Kick Members |
| `/ban member:@member reason:text` or `,ban @member reason` | Bans a member from the server. | Ban Members |
| `/unban user:@user reason:text` or `,unban @user-or-id reason` | Removes a user's ban. | Ban Members |
| `/warn member:@member reason:text` or `,warn @member reason` | Records a member warning. | Moderate Members |

Register slash commands with `npm run deploy`. Prefix commands need the Message Content Intent.

## Experience

Members earn 5 XP for eligible messages and slash command use. XP is tracked separately in each server. Onion awards XP at most once per member per server each minute; bots and messages under five characters do not earn XP.

## Snipe

Only the latest deleted non-bot message in a channel is available. It expires after 30 seconds and can be sniped once. A successful snipe stores text and attachments with the requester, original author, deletion time, and snipe time. History belongs to the requester; it is not a shared history feed. Onion keeps only each person's 10 most recent snipes.

## Invites

Use `/invites log #channel` or `,invites log #channel` to configure join logs. Onion compares current invite use counts with its saved snapshot to identify the inviter. It only attributes a join when one tracked invite increases by one; overlapping joins, vanity links, expired one-use links, and missed snapshots show **Unknown** instead of naming the wrong person. Logs show the joining user, account creation date, inviter, joined time, avatar, and moderator Kick/Ban buttons.

`/invites me` or `,invites` shows invite uses attributed to you: current members, total joins, departures, and accounts younger than seven days. Every rejoin counts as another invite use.

Use `/inviter member:@member` or `,inviter @member` to look up the inviter for that member's latest tracked join. It shows **Unknown** when Onion did not observe the join or could not identify the invite.

## Moderation

All moderation actions require a reason (up to 500 characters), verify the moderator's permission and role hierarchy, and are recorded in Onion's guild log. Warnings are also saved in the database with a warning ID. Onion cannot act on a member it cannot moderate because of Discord permissions or role position.
