# AI

This directory contains AI assistant operations and patterns for the Aegis framework, defining how the AI assistant interacts with the framework and implements commands.

## Directory Structure

- `operations/`: Operation patterns and command implementation YAML files

## Purpose

The AI directory serves as a guide for the AI assistant, providing:

1. **Operation Patterns**: Structured patterns for implementing framework commands
2. **Command Implementations**: Specific implementations for each command
3. **Validation Rules**: Rules for validating framework state and operations

## Key Files

- `operations/plan.yaml`: Planning operations
- `operations/start.yaml`: Session start operations
- `operations/save.yaml`: Session save operations
- `operations/status.yaml`: Status reporting operations
- `operations/task.yaml`: Task management operations
- `operations/context.yaml`: Context refresh operations
- `operations/help.yaml`: Help display operations
- `operations/validation.yaml`: Framework validation rules

## Usage

The AI directory is used by the AI assistant to understand how to implement framework commands and operations. It provides structured patterns and rules that ensure consistent and correct implementation of the Aegis framework.

## Command Implementation

Each command implementation follows a specific pattern:

1. **Pre-Operation Checks**: Validation before performing the operation
2. **Actions**: Steps to perform the operation
3. **Post-Operation Checks**: Validation after performing the operation

## Validation

The AI directory includes validation rules for:
- Framework structure
- Task states
- Memory consistency
- Reference integrity
- Content completeness

## Updates

The AI directory may be updated to improve command implementations, add new commands, or refine validation rules as the framework evolves.
