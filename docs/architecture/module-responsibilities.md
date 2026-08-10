# Module Responsibilities

## Purpose

Each module in the backend has a single, well-defined responsibility. This keeps the codebase maintainable, testable, and scalable.

---

## auth

Responsible for:

- Authentication
- JWT handling
- Password hashing
- Token validation
- Permission checks

---

## config

Responsible for:

- Loading configuration
- Environment variables
- Application settings

---

## database

Responsible for:

- Database connection
- Connection pool
- Migrations
- Transactions

---

## models

Responsible for:

- Domain models
- Shared business data structures

---

## dto

Responsible for:

- Request DTOs
- Response DTOs
- Data transfer between layers

---

## repositories

Responsible for:

- Database queries
- CRUD operations
- Persistence

---

## services

Responsible for:

- Business logic
- Validation
- Workflow orchestration

---

## handlers

Responsible for:

- HTTP request handling
- Calling services
- Returning responses

---

## routes

Responsible for:

- API endpoint registration
- Router composition

---

## middleware

Responsible for:

- Authentication
- Logging
- Rate limiting
- Request tracing

---

## validation

Responsible for:

- Input validation
- Business rule validation helpers

---

## websocket

Responsible for:

- Real-time communication
- Connection management

---

## jobs

Responsible for:

- Background tasks
- Scheduled jobs
- Queue workers

---

## response

Responsible for:

- Standard API responses
- Error response formatting

---

## state

Responsible for:

- Shared application state
- Dependency injection

---

## utils

Responsible for:

- Reusable helper functions
- Common utilities

---

## errors

Responsible for:

- Error definitions
- Error conversions
- Application-wide error handling

---

## extractors

Responsible for:

- Custom Axum extractors
- Authentication extractors
- Request parsing helpers

---

## entities

Responsible for:

- Database entities
- ORM/database mapping structures