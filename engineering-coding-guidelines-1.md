# Engineering Coding Guidelines

**Owner:** Architecture Team · **Status:** Living document · **Last reviewed:** 2026-07

---

## 1. Purpose & how to read this

These guidelines exist to make our code **readable, consistent, and safe to change** — not to enforce personal taste. When a rule earns its place here, it's because inconsistency in that area has cost us real time, bugs, or review friction.

**Conformance keywords** (RFC 2119 style):

- **MUST** — non-negotiable. Enforced by tooling or a review block. Deviations require an approved exception recorded in an ADR.
- **SHOULD** — the default. Deviate only with a reason you'd be comfortable defending in review.
- **MAY** — allowed; use judgment.

**A guiding meta-rule:** anything a tool can check, a human MUST NOT spend review time on. Formatting, ordering, and style are settled by the analyzer and formatter (§4). Human review is reserved for design, naming, boundaries, and correctness.

---

## 2. Guiding principles

1. **Optimize for the reader, not the writer.** Code is read far more often than written. Prefer the boring, obvious solution over the clever one.
2. **Simplicity first (YAGNI / KISS).** Build for the requirements you have, plus the seams you know you'll need. Do not add abstraction, configurability, or generality on speculation.
3. **Consistency beats individual preference.** Two reasonable options, one chosen — follow the chosen one. Local consistency (with the file/module you're in) outranks even these guidelines when they conflict.
4. **Make the boundaries explicit.** Domain logic does not know about HTTP, EF Core, or the file system. Dependencies point inward.
5. **Fail loudly, fail early.** Prefer an exception at startup or at the boundary over silent corruption discovered three systems downstream.
6. **Leave it cleaner than you found it** — but keep refactors out of feature PRs (§16).

---

## 3. Layering & dependency rules (MUST)

We follow a clean/onion layering. The dependency arrow points inward only:

```
API / Host  →  Application  →  Domain
     ↘            ↘
      Infrastructure (EF Core, external services)  →  Domain
```

- The **Domain** layer MUST NOT reference EF Core, ASP.NET, `HttpContext`, or any infrastructure package.
- The **Application** layer orchestrates use cases; it depends on abstractions (interfaces) defined near the domain, never on concrete infrastructure.
- Cross-cutting concerns (logging, validation, transactions) live in the composition root or in pipeline behaviors — not sprinkled through domain code.
- Circular project references are forbidden (enforced by build).

---

## 4. Formatting & style — owned by tooling

We do not debate formatting in review. It is settled by:

- **`.editorconfig`** at the repo root is the single source of truth for indentation, `using` ordering, naming rules, and analyzer severities. It MUST be committed and MUST NOT be overridden per-developer.
- **`dotnet format`** runs in CI and in the pre-commit hook. A PR that isn't formatted fails the build.
- **Analyzers as errors.** We run the .NET analyzers plus our agreed ruleset with warnings-as-errors on `main`. Suppressions MUST be local (`#pragma` or attribute) with a justification comment — never blanket-disabled in a project file.

If you disagree with a formatting rule, change the `.editorconfig` via PR — don't work around it.

---

## 5. Naming (MUST)

Good names are the cheapest documentation we have.

- Types, methods, properties: `PascalCase`. Locals, parameters: `camelCase`. Constants: `PascalCase`. Private fields: `_camelCase`.
- Interfaces are prefixed `I` (`IPaymentGateway`). We do **not** use Hungarian notation otherwise.
- Names describe **intent**, not type or implementation. `CustomerRepository`, not `CustomerManager`; `dueDate`, not `dateValue`; `RegisterCustomer`, not `DoRegister`.
- Async methods end in `Async`.
- Avoid abbreviations except universally understood ones (`Id`, `Db`, `Http`). No `custMgr`, no `svc`.
- Booleans read as assertions: `isActive`, `hasPendingOrders`, `canRefund`.
- Prefer a longer clear name over a short cryptic one. Nobody has ever been confused by a name that was too descriptive.

---

## 6. C# language usage

- **Nullable reference types MUST be enabled** solution-wide. A parameter that can't be null is `Customer`; one that can is `Customer?`. Do not suppress with `!` except at a genuinely-checked boundary, with a comment.
- **`var`** SHOULD be used when the type is obvious from the right-hand side; use the explicit type when it aids readability. Be consistent within a file.
- **Records** for immutable data / DTOs / value objects. Classes for entities with identity and behavior.
- **Expression-bodied members** MAY be used for trivial one-liners; don't force them onto anything with branching.
- **Pattern matching and switch expressions** are preferred over long `if/else` ladders on type or state.
- Prefer **immutability**: `readonly` fields, `init`-only setters, and returning new instances over mutating shared state.
- **Guard clauses** over nested conditionals. Return/throw early; keep the happy path at the lowest indentation.
- No "magic" values. Extract literals to named constants or enums.

---

## 7. Async & concurrency (MUST)

- **Async all the way.** Do not block on async code with `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()` — this is the fastest route to a deadlock and a thread-pool starvation incident.
- Pass and honor a **`CancellationToken`** on every async method that reaches I/O. Thread it from the controller/endpoint down.
- Use `ConfigureAwait(false)` in library code that has no sync-context dependency.
- Never `async void` except for event handlers.
- Don't fire-and-forget without a deliberate, logged strategy (`Task.Run` background work belongs in a hosted service, not a request handler).

---

## 8. Error handling (MUST)

- **Exceptions are for exceptional, unexpected conditions.** Expected outcomes (validation failure, "not found", business-rule rejection) MUST be modeled as return values — a result type or a typed response — not thrown.
- Never `catch (Exception)` and swallow. Either handle meaningfully, enrich and rethrow (`throw;`, not `throw ex;` — preserve the stack), or let it bubble to the global handler.
- Throw the most specific exception type; include context in the message, but **never** secrets or PII.
- One global exception handler at the API boundary maps exceptions to problem responses (`ProblemDetails`). Don't hand-roll try/catch in every controller.
- Validate inputs at the boundary; trust them inside the domain.

---

## 9. Logging & observability (MUST)

- Use **structured logging** with message templates — never string interpolation into the log message:

  ```csharp
  // Do
  logger.LogInformation("Order {OrderId} shipped to {Region}", order.Id, region);
  // Don't
  logger.LogInformation($"Order {order.Id} shipped to {region}");
  ```

- Every request carries a **correlation/trace id**; propagate it across service and message boundaries.
- Log levels mean something: `Error` = needs human attention; `Warning` = recoverable oddity; `Information` = business milestones; `Debug`/`Trace` = diagnostics, off in prod by default.
- **Never log secrets, credentials, tokens, or PII.** This is a security requirement, not a style preference.
- Instrument the things you'll be paged about: emit metrics and traces for external calls, queue depth, and key business events.

---

## 10. Data access — EF Core & SQL Server (MUST)

This is where we've historically leaked the most performance and correctness bugs, so the rules here are firm.

- **Reads that don't update MUST use `AsNoTracking()`.** Don't pay for change tracking you don't use.
- **Project to DTOs in the query** (`.Select(...)`) instead of loading full entities and mapping in memory. Pull only the columns you need.
- **Lazy loading is disabled.** Load related data explicitly with `Include`/projection. This makes N+1 queries visible in code review instead of in production.
- **No N+1.** If you're querying inside a loop, stop and reshape the query.
- **Repositories expose domain-meaningful methods** (`GetOverdueInvoicesAsync`) — not a generic `IRepository<T>` with `IQueryable` leaking out. Use the Specification pattern where query composition genuinely varies. (A generic repository over EF Core is an anti-pattern for us: `DbSet<T>` already is that repository.)
- **Migrations are code-reviewed.** Inspect the generated SQL; never edit the database out-of-band. Migrations MUST be forward-only and safe to run against production (no blocking rewrites of hot tables without a plan).
- **Business logic does not live in the database.** No behavior in triggers or stored procedures except where a measured performance need justifies it and it's documented.
- **All queries are parameterized** (EF does this for you). Any raw SQL MUST use parameters — never string concatenation (§13).
- Keep transactions short; know your unit-of-work boundary (typically one `SaveChangesAsync` per use case).

---

## 11. API & contract design (SHOULD)

- Public APIs expose **DTOs, never EF entities.** Don't let your persistence model become your wire contract.
- Follow REST conventions: nouns for resources, correct verbs and status codes, `ProblemDetails` for errors.
- **Validate at the edge** (e.g. FluentValidation) and return `400` with a clear, machine-readable payload.
- **Version from day one** (`/v1/`). Breaking a published contract requires a new version and a deprecation path.
- Contracts are documented (OpenAPI) and the docs are generated from code, not maintained by hand.

---

## 12. Testing (MUST)

- Follow the **test pyramid**: many fast unit tests, fewer integration tests, a thin layer of end-to-end. Domain logic is unit-tested with no I/O.
- **Every bug fix ships with a test** that fails before the fix and passes after.
- Test names state the scenario and expectation: `RegisterCustomer_WithDuplicateEmail_ReturnsConflict`.
- **Arrange-Act-Assert**, one logical assertion focus per test. No control flow (`if`/`for`) in tests — a test with branches is a test that needs splitting.
- Prefer **test data builders / object mothers** over sprawling inline setup.
- Integration tests run against a real SQL Server (Testcontainers), not an in-memory provider — the in-memory provider hides real query behavior.
- Tests MUST be deterministic and independent (no shared mutable state, no ordering dependence, no reliance on wall-clock/timezone).

---

## 13. Security (MUST)

- **Never concatenate user input into SQL, shell, or file paths.** Parameterize everything.
- **Secrets are never committed.** Use the secret store / key vault; local dev uses user-secrets. A committed secret is a rotate-immediately incident.
- **Validate and encode at the boundaries** — trust nothing from the client, another service, or the queue.
- Authorize on the **server**, per operation, against the authenticated principal — never trust a client-supplied role or id.
- Keep dependencies patched; the vulnerability scanner gate (§15) MUST pass.
- Apply least privilege to DB accounts, service identities, and API scopes.

---

## 14. Performance (SHOULD)

- **Measure before optimizing.** No performance change lands without a benchmark or profile showing it helped.
- Watch the usual suspects: N+1 queries (§10), unbounded result sets (always paginate), chatty external calls, and allocations in hot paths.
- Cache deliberately, with an explicit invalidation story. An un-invalidatable cache is a bug waiting to happen.
- Set timeouts on every outbound call; assume the network fails.

---

## 15. Dependencies (SHOULD)

- Prefer the framework and the standard library before adding a package. Every dependency is a liability you now own.
- New third-party dependencies need a quick check: is it maintained, appropriately licensed, and does it pass the vulnerability scan? Non-trivial additions warrant a one-line ADR.
- Pin versions centrally (`Directory.Packages.props`). No floating versions.

---

## 16. Version control & pull requests (MUST)

- **Small, focused PRs.** One logical change. A reviewer should be able to hold the whole thing in their head. Refactors go in their own PR, separate from behavior changes.
- **Conventional commit** messages (`feat:`, `fix:`, `refactor:`…). The subject says *why*, not just *what*.
- Trunk-based / short-lived branches; rebase to keep history readable; `main` is always releasable.
- **Never commit** secrets, large binaries, commented-out code, or `TODO` without a tracking reference.
- CI (build + format + analyzers + tests + security scan) MUST be green before merge.

---

## 17. Code review (MUST)

- Review for **design, correctness, naming, boundaries, and tests** — not formatting (the tools own that).
- Be specific and kind; critique the code, not the author. Distinguish blocking issues from suggestions (prefix nits with `nit:`).
- The author addresses or explicitly responds to every comment. Unresolved blocking comments prevent merge.
- Reviewers respond within one business day to avoid becoming the bottleneck.
- Approving means "I understand this and I'd be comfortable maintaining it."

---

## 18. Comments & documentation (SHOULD)

- **Comment the *why*, not the *what*.** The code says what it does; comments explain intent, trade-offs, and the non-obvious. If a comment restates the code, delete one of them — usually the comment.
- Public APIs and non-obvious domain rules get XML doc comments.
- Delete dead and commented-out code. Version control remembers it for you.
- A surprising decision belongs in an **ADR** (Architecture Decision Record), not buried in a comment.

---

## 19. Governance — how these guidelines change

- This is a **living document** owned by the Architecture Team, but anyone can propose a change via PR.
- A rule that can't be automated *and* can't be explained with a concrete cost it prevents is a candidate for deletion. We keep this short on purpose.
- Significant or contested changes are captured as ADRs and announced to all teams.
- We review the whole document quarterly for anything that's gone stale.

---

*These guidelines assume a .NET / EF Core / SQL Server stack; adapt the language-specific sections (§6, §7, §10) for other stacks while keeping the principles (§2), boundaries (§3), and governance (§19) intact.*
