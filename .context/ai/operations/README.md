# Operations

This directory contains operation patterns and command implementation YAML files for the Aegis framework, defining how the AI assistant implements framework commands.

## Purpose

The operations directory provides structured patterns for implementing framework commands, ensuring consistency and correctness in command execution.

## Key Files

- `plan.yaml`: Planning operations
- `start.yaml`: Session start operations
- `save.yaml`: Session save operations
- `status.yaml`: Status reporting operations
- `task.yaml`: Task management operations
- `context.yaml`: Context refresh operations
- `help.yaml`: Help display operations
- `validation.yaml`: Framework validation rules
- `session_triggers.yaml`: Session update trigger patterns

## Operation Pattern Structure

Each operation pattern follows a specific structure:

```yaml
command_name:
  pre_checks:
    - check_1
    - check_2
    - ...
  actions:
    - action_1
    - action_2
    - ...
  post_checks:
    - check_1
    - check_2
    - ...
```

### Pre-Operation Checks

Pre-operation checks validate the framework state before performing an operation, ensuring that the operation can be executed safely and correctly.

Examples:
- Framework structure validation
- Task state validation
- Memory consistency checks
- Reference integrity checks

### Actions

Actions are the steps performed to execute the operation, such as creating files, updating content, or generating reports.

Examples:
- Creating a new task file
- Updating a task's status
- Generating a status report
- Recording a decision

### Post-Operation Checks

Post-operation checks validate the framework state after performing an operation, ensuring that the operation was executed correctly and the framework is in a consistent state.

Examples:
- Verifying file creation
- Checking content updates
- Validating reference updates
- Ensuring state consistency

## Usage

The operation patterns in this directory are used by the AI assistant to implement framework commands. When a user issues a command, the AI assistant follows the corresponding operation pattern to execute the command correctly.

## Updates

Operation patterns may be updated to improve command implementations, add new commands, or refine validation rules as the framework evolves.
