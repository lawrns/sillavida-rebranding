# Planned Tasks

This directory contains tasks that have been defined but not yet started. These tasks are ready to be worked on but are not currently active.

## Task Management

When a task is ready to be worked on, it should be moved to the `active` directory using the following command:

```
/aegis task start TASK-XXX
```

This will:
1. Move the task file from `planned/` to `active/`
2. Update the task's status in the front matter
3. Update the task's timestamp
4. Update the project state

## Task Creation

New tasks are created in this directory using:

```
/aegis task create "Task Title"
```

This will:
1. Create a new task file in this directory
2. Assign a unique TASK-XXX identifier
3. Set the initial status to "planned"
4. Update the project state

## Current Planned Tasks

Tasks in this directory are ready to be started when resources are available.
