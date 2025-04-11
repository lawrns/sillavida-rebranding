# Session Memory

This directory contains temporary session state and context for the Aegis framework, tracking information specific to the current development session.

## Purpose

Session memory serves as a temporary storage for active session information, providing:

1. **Current Session**: Information about the active development session
2. **History**: Recent session history and context
3. **Cache**: Temporary data used during the session

## Key Files

- `current.json`: Information about the current active session
- `history.json`: Recent session history and context
- `cache.json`: Temporary data used during the session

## Usage

Session memory is primarily used by the Aegis framework itself and is updated during session operations such as:
- Starting a new session
- Saving session progress
- Updating session focus
- Recording session activities

## Validation

Session memory is validated using:
- State validation to ensure consistency with project memory
- Reference checks to ensure valid connections
- Format checks to ensure proper structure

## Lifecycle

Session memory follows a specific lifecycle:
1. Initialization when a session starts
2. Updates during the session
3. Finalization when the session is saved
4. Archiving when a new session starts

## Recovery

In case of corruption or inconsistency, session memory can be reconstructed from project memory and session documents.
