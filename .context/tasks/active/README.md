# Active Tasks

This directory contains tasks that are currently being worked on. These tasks have been started but are not yet completed.

## Task Management

When work on a task is completed, it should be moved to the `completed` directory using:

```
/aegis task complete TASK-XXX
```

If a task becomes blocked or needs to be paused, it can be moved to the `hold` directory using:

```
/aegis task hold TASK-XXX
```

Both of these commands will:
1. Move the task file to the appropriate directory
2. Update the task's status in the front matter
3. Update the task's timestamp
4. Update the project state

## Progress Tracking

Progress on active tasks should be documented in the task file's Progress section:

```markdown
## Progress
- [2025-04-11] Started implementation of feature X
- [2025-04-12] Completed component Y
```

## Current Active Tasks

Tasks in this directory represent the current work in progress.
