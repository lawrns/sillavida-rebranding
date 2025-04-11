# Decisions

This directory contains records of important decisions made during the project. Decision records serve as documentation for why certain approaches were chosen and provide context for future development.

## Decision Record Format

Each decision is stored in a Markdown file with the following naming convention:

```
YYYY-MM-DD_HH-MM-SS_decision_title.md
```

The content follows this structure:

```markdown
---
title: Decision Title
type: decision
status: [proposed|accepted|rejected|superseded]
created: YYYY-MM-DDTHH:MM:SS
updated: YYYY-MM-DDTHH:MM:SS
id: DECISION-XXX
related_tasks: [TASK-XXX, TASK-YYY]
supersedes: [DECISION-ZZZ]
superseded_by: [DECISION-AAA]
---

# Decision: Decision Title

## Context
Description of the problem or situation that necessitated this decision.

## Options Considered
### Option 1: [Option Name]
- **Pros**: 
  - Pro 1
  - Pro 2
- **Cons**:
  - Con 1
  - Con 2

### Option 2: [Option Name]
- **Pros**: 
  - Pro 1
  - Pro 2
- **Cons**:
  - Con 1
  - Con 2

## Decision
The option that was chosen and why.

## Consequences
The expected outcomes and impacts of this decision.

## Notes
Additional information or considerations.
```

## Decision Management

Decisions are created and managed using the `/aegis decision` command:

```
/aegis decision create "Decision Title"
```

## Decision Types

Decisions can be categorized into different types:

- **Technical**: Architecture, technology, implementation choices
- **Process**: Workflow, methodology, approach decisions
- **Resource**: Time, effort, priority allocations
- **Strategic**: Long-term direction and goals

## Current Decisions

This directory contains all decisions made throughout the project lifecycle.
