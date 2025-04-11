# Sessions

This directory contains records of development sessions for the Silla Vida project. Each session document captures the focus, progress, decisions, and insights from a specific development session.

## Session File Format

Session files are named using the date and time of the session:

```
YYYY-MM-DD_HH-MM-SS.md
```

Each session document follows this structure:

```markdown
---
title: Development Session
type: session
status: active
created: YYYY-MM-DDTHH:MM:SS
updated: YYYY-MM-DDTHH:MM:SS
id: SESSION-XXX
memory_types: [procedural, semantic, episodic]
---

# Development Session: YYYY-MM-DD

## Focus
- Primary focus areas for the session

## Context
- Current project state and context

## Progress
- Work completed during the session

## Decisions
- Key decisions made during the session

## Self-Improvement
- Insights and recommendations for process improvement

## Dependencies
- Dependencies identified or addressed

## Next Steps
- Planned next steps after this session

## Notes
- Additional notes and observations
```

## Session Management

Sessions are managed using the `/aegis` commands:

- `/aegis start`: Begin a new development session
- `/aegis save`: Save progress and end the current session
- `/aegis status`: Show the current session status

## Current Sessions

This directory contains all session records for the project, providing a historical record of development activities and decisions.
