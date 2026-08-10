# Request Flow

## Overview

Every HTTP request follows the same lifecycle throughout the application.

```
                HTTP Request
                      │
                      ▼
                Axum Router
                      │
                      ▼
                 Middleware
                      │
                      ▼
                 Extractors
                      │
                      ▼
                  Handlers
                      │
                      ▼
                  Services
                      │
                      ▼
               Repositories
                      │
                      ▼
                 PostgreSQL
                      │
                      ▼
                Repositories
                      │
                      ▼
                  Services
                      │
                      ▼
                  Handlers
                      │
                      ▼
             Standard Response
                      │
                      ▼
                HTTP Response
```

---

# Request Lifecycle

## 1. Router

Responsibilities

- Match incoming route
- Select handler
- Apply middleware

---

## 2. Middleware

Responsibilities

- Authentication
- Authorization
- Logging
- Rate Limiting
- Request ID
- CORS

---

## 3. Extractors

Responsibilities

- Parse JSON
- Parse Path Parameters
- Parse Query Parameters
- Validate Headers

---

## 4. Handlers

Responsibilities

- Validate request
- Call business service
- Return HTTP response

Handlers should NOT contain business logic.

---

## 5. Services

Responsibilities

- Business logic
- Validation
- Permission checks
- Transactions
- Communication with repositories

---

## 6. Repositories

Responsibilities

- SQL Queries
- CRUD Operations
- Database Transactions

Repositories should NOT contain business logic.

---

## 7. Response Layer

Responsibilities

- Convert service results into API responses
- Standardize success responses
- Standardize error responses