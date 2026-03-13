# Threadline Platform

Threadline is a fashion e-commerce platform currently under development.  
This repository contains the core codebase and CI/CD setup used to manage the project's development workflow.

## Project Overview
The goal of Threadline is to build a scalable fashion e-commerce platform that supports product browsing, ordering, and user management.

## Repository Structure

.github/workflows/  
Contains GitHub Actions workflows for CI/CD.

src/  
Application source code.

tests/  
Unit tests for the project.

## CI/CD Pipeline

This repository uses **GitHub Actions** to automatically run checks on every push and pull request.

The pipeline performs the following steps:
- Install project dependencies
- Run ESLint for code quality
- Execute unit tests
- Build the application

This ensures that all code merged into the main branch passes basic quality and build checks.

## Branch Protection

To maintain code quality, the `main` branch should be protected by requiring:

- Pull requests before merging
- Successful CI checks
- Code review approval

## Getting Started

Clone the repository:

```bash
git clone https://github.com/hunny0025/threadline-platform.git
cd threadline-platform
