# HEARTBEAT.md

Check for pending notifications, cron job results, and system events.
If nothing needs attention, reply HEARTBEAT_OK.

- **Check Subagents**: Run `subagents list` to see if any tasks have finished. If a subagent is done but I haven't reported it, summarize the result and tell the user.
