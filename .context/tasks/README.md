# Tasks

This directory contains all tasks for the Silla Vida project, organized by their current status.

## Directory Structure

- `planned/`: Tasks that are defined but not yet started
- `active/`: Tasks that are currently in progress
- `hold/`: Tasks that are temporarily paused (e.g., waiting for dependencies)
- `completed/`: Tasks that have been finished

## Task Workflow

Tasks follow a specific workflow through these directories:

1. Tasks are created in `planned/` when they are defined
2. When work begins on a task, it is moved to `active/` using `mv`
3. If a task is blocked, it can be moved to `hold/` using `mv`
4. When a task is completed, it is moved to `completed/` using `mv`

## Task File Format

Each task is stored in a Markdown file with the following structure:

```markdown
---
title: Task Title
type: task
status: [planned|active|completed|hold]
created: YYYY-MM-DDTHH:MM:SS
updated: YYYY-MM-DDTHH:MM:SS
id: TASK-XXX
priority: [high|medium|low]
memory_types: [procedural|semantic|episodic]
dependencies: []
tags: []
---

# Task Title

## Description
Detailed description of the task.

## Objectives
- Specific objective 1
- Specific objective 2
- ...

## Steps
1. Step 1
2. Step 2
3. ...

## Progress
- [YYYY-MM-DD] Progress update

## Dependencies
- Dependency 1
- Dependency 2
- ...

## Test Status
- Status: [Not Started|Failing|Passing|Not Applicable]
- Test Files: [List of test files]

## Notes
Additional notes about the task.

## Next Steps
- Next step 1
- Next step 2
- ...
```

## Task Management

Tasks are managed using the `/aegis task` command, which handles:
- Creating new tasks
- Updating task status
- Moving tasks between directories
- Tracking task progress
