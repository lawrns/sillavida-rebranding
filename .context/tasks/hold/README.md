# Hold Tasks

This directory contains tasks that have been started but are currently paused or blocked. These tasks are not actively being worked on due to dependencies, blockers, or resource constraints.

## Task Management

When a task is no longer blocked and can be resumed, it should be moved back to the `active` directory using:

```
/aegis task resume TASK-XXX
```

This will:
1. Move the task file from `hold/` to `active/`
2. Update the task's status in the front matter
3. Update the task's timestamp
4. Update the project state

## Documenting Blockers

When a task is placed on hold, the reason should be documented in the task file's Notes section:

```markdown
## Notes
- [2025-04-11] Task placed on hold due to dependency on TASK-YYY
```

## Current Hold Tasks

Tasks in this directory are waiting to be resumed once their blockers are resolved.
