# Core Memory

This directory contains the core memory for the Aegis framework, storing fundamental knowledge and operation patterns needed for framework functionality.

## Purpose

Core memory serves as the foundation for the Aegis framework's operation, providing:

1. **Configuration**: Settings and parameters for framework operation
2. **Rules**: Operational rules and constraints
3. **State**: Framework state information

## Key Files

- `config.json`: Configuration settings for the framework
- `rules.json`: Rules and constraints for framework operations
- `state.json`: Current state of the framework

## Usage

Core memory is primarily used by the Aegis framework itself and should not be manually edited unless necessary for recovery or reconciliation purposes.

## Validation

Core memory files are validated using:
- Schema checks to ensure proper structure
- Rule checks to ensure consistency
- Reference checks to ensure valid connections

## Memory Operations

Core memory is updated during framework operations such as:
- Framework initialization
- Configuration changes
- State transitions
- Rule updates

## Recovery

In case of corruption or inconsistency, core memory can be restored from templates or reconstructed from other memory types.
