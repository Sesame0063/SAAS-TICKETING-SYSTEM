# Coding Standards

## Naming Conventions

### Files

Use snake_case.

Examples:

- user_service.rs
- ticket_repository.rs
- auth_handler.rs

---

### Structs

Use PascalCase.

Examples:

- User
- Ticket
- AppState

---

### Traits

Use PascalCase.

Examples:

- UserRepository
- TicketService

---

### Functions

Use snake_case.

Examples:

- create_ticket()
- get_user()
- verify_password()

---

### Constants

Use UPPER_SNAKE_CASE.

Examples:

- MAX_FILE_SIZE
- DEFAULT_PAGE_SIZE

---

## General Rules

- One responsibility per module.
- Keep functions small and focused.
- Avoid duplicated code.
- Prefer composition over inheritance.
- Return `Result<T, E>` for fallible operations.
- Avoid `unwrap()` and `expect()` in production code.

---

## Error Handling

- Define custom application errors.
- Propagate errors using `?`.
- Return meaningful API responses.

---

## Documentation

- Public modules should have documentation comments.
- Complex logic should include explanatory comments.
- Keep the README and architecture documents updated as the project evolves.

---

## Formatting

Before every commit, run:

```bash
cargo fmt
cargo clippy
cargo check
```

All three commands should succeed before code is merged.