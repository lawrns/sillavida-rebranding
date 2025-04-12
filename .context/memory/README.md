# Memory

This directory contains the memory system for the Aegis framework, storing various types of information needed for project management and operation.

## Directory Structure

- `core/`: Framework knowledge and operation patterns
- `project/`: Project-specific memory and state
  - `context/`: Project context data
  - `self_improvement.json`: Self-improvement metrics and recommendations
- `session/`: Temporary session state and context

## Memory Types

The Aegis framework uses different types of memory:

1. **Core Memory**
   - Purpose: Framework operation
   - Content: Configuration, rules, state
   - Location: `core/`

2. **Project Memory**
   - Purpose: Project state
   - Content: Context, decisions, progress
   - Location: `project/`

3. **Session Memory**
   - Purpose: Active state
   - Content: Current session, history, cache
   - Location: `session/`

## Key Files

- `project/context/project.json`: Contains the current project state, including active tasks, completed tasks, and project components
- `project/self_improvement.json`: Stores metrics, insights, and recommendations for process improvement
- `SELF_IMPROVEMENT.md`: Documentation for the self-improvement system

## Memory Operations

The memory system is managed by the Aegis framework and updated during operations such as:

- Starting a new session
- Saving session progress
- Creating or updating tasks
- Recording decisions
- Generating insights

## Usage

The memory system is primarily used by the Aegis framework itself and should not be manually edited unless necessary for recovery or reconciliation purposes.
