# JavaScript coding standards

Consistent JavaScript conventions improve readability, collaboration, maintenance, and extension of the codebase. Projects SHOULD enforce these standards with ESLint, Prettier, and a repository-level `.editorconfig` rather than relying on manual review alone.

### Naming

- Use `PascalCase` for classes and constructor functions: `OrderShippingService`.
- Use `camelCase` for functions, methods, properties, parameters, and local variables: `saveOrder`, `orderStatus`, `distanceMeters`.
- Use `#camelCase` for private class fields when true class privacy is required: `#orderRepository`.
- Boolean names SHOULD describe a true condition: `isActive`, `hasPermission`, `canRetry`, `shouldRefresh`.
- Asynchronous functions SHOULD use normal action-oriented names: `saveOrder`, not `saveOrderAsync`. The `async` declaration and returned `Promise` already communicate asynchronous behavior.
- Use `UPPER_SNAKE_CASE` for true module-level constants whose values are fixed and treated as application constants: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MILLISECONDS`. Do not capitalize a value merely because it is declared with `const`.
- Avoid vague names such as `Manager`, `Helper`, `Utility`, `Processor`, `Data`, and `Info` unless the name clearly describes a cohesive responsibility.
- Include units when ambiguity is possible: `timeoutMilliseconds`, `distanceMeters`, `fileSizeBytes`.
- Do not encode implementation types unnecessarily: prefer `customers` over `customerArray` or `customerList`.
- Functions SHOULD normally use verb or verb-phrase names: `calculateTotal`, `loadCustomer`, `renderScene`.
- Event-handler functions MAY use the `handle` prefix when it clarifies their role: `handleKeyDown`, `handleSubmit`.

```javascript
const OrderStatus = Object.freeze({
  PENDING: 'pending',
  SHIPPED: 'shipped',
});

class Customer {
  constructor(customerId, isActive, hasPermission) {
    this.customerId = customerId;
    this.isActive = isActive;
    this.hasPermission = hasPermission;
  }
}

class Order {
  constructor(orderId) {
    this.orderId = orderId;
    this.status = OrderStatus.PENDING;
  }

  markAsShipped() {
    this.status = OrderStatus.SHIPPED;
  }
}

class OrderShippingService {
  #orderRepository;

  constructor(orderRepository) {
    this.#orderRepository = orderRepository;
  }

  async shipOrder(
    order,
    customer,
    distanceMeters,
    timeoutMilliseconds,
    signal,
  ) {
    const isActive = customer.isActive;
    const hasPermission = customer.hasPermission;
    const canShip = distanceMeters > 0 && timeoutMilliseconds > 0;

    if (!isActive || !hasPermission || !canShip) {
      return false;
    }

    order.markAsShipped();

    await this.#orderRepository.saveOrder(order, { signal });

    return true;
  }
}
```

### Code structure

- Treat ESLint errors and important warnings as build or continuous-integration failures.
- Use Prettier or another agreed formatter so formatting is automated and consistent.
- Use braces for control structures, including single-line statements.
- Keep one statement per line.
- Prefer guard clauses over deeply nested conditions.
- Keep functions and methods focused and at one conceptual level.
- Avoid functions with numerous Boolean parameters. They often hide multiple behaviors.
- Avoid constructors with many dependencies. They usually indicate excessive responsibility.
- Avoid mutable global or module-level state.
- Avoid deeply nested callbacks. Prefer `async`/`await`, promises, or extracted functions where they improve readability.
- Keep modules cohesive. Split oversized modules instead of using comments or sections to disguise excessive responsibility.
- Do not place unrelated classes, functions, constants, and side effects into a single catch-all module.
- Keep side effects explicit and near application boundaries where practical.

### Language usage

- Use `const` by default. Use `let` only when reassignment is required. Do not use `var` in new code.
- Prefer strict equality with `===` and `!==`. Use loose equality only when coercion is intentional, understood, and justified.
- Prefer immutable values and data flow where practical. Avoid mutating shared objects from unrelated parts of the application.
- Use classes when an object has identity, state, and cohesive behavior. Use plain objects for simple data-oriented values when a class adds no value.
- Prefer ES modules with `import` and `export` for modern JavaScript projects.
- Avoid magic strings and numbers. Use named constants, lookup objects, configuration, or other domain-specific representations.
- Prefer template literals for interpolation: `` `Order ${orderId} shipped.` ``.
- Use destructuring when it improves readability; do not destructure merely to use newer syntax.
- Use optional chaining (`?.`) when a value is legitimately optional and skipping access is the intended behavior.
- Use nullish coalescing (`??`) when a fallback should apply only to `null` or `undefined`. Do not substitute `||` when valid falsy values such as `0`, `false`, or `''` must be preserved.
- Do not rely on implicit type coercion when explicit conversion makes the intent clearer. Prefer `Number(value)`, `String(value)`, and `Boolean(value)` when conversion is intentional.
- Prefer array iteration methods such as `map`, `filter`, `find`, `some`, and `every` when they express the operation more clearly than manual looping. Do not force functional methods when a simple loop is clearer.
- Use `for...of` for iteration over iterable values when direct iteration is clearer. Avoid `for...in` for arrays.
- Do not modify built-in prototypes such as `Array.prototype`, `Object.prototype`, or `String.prototype`.
- Avoid `eval`, `Function` constructors, and dynamic code execution unless an exceptional requirement explicitly justifies the security and maintainability risk.
- Avoid broad exception handling. Catch errors only when the code can add context, recover, translate the error, or handle it at an application boundary.
- Do not silently swallow exceptions.
- When rethrowing an error, preserve the original error or use an error cause when adding context.
- Prefer `async`/`await` for sequential asynchronous workflows when it improves readability.
- Always handle rejected promises. Do not intentionally create floating promises unless that behavior is explicit and safe.
- Use `AbortController` / `AbortSignal` when asynchronous browser or platform operations should support cancellation.
- Use default parameters when a sensible default belongs to the function contract.
- Prefer rest parameters (`...values`) over the legacy `arguments` object.
- Prefer spread syntax when it clearly expresses copying or composition, while remembering that object and array spreads are shallow copies.
- Guard clauses are preferred over nested conditionals. Return or throw early and keep the happy path at the lowest indentation.
- No "magic" values. Extract significant literals to named constants or configuration.

### Modules and dependencies

- Use explicit imports and exports. Avoid hidden dependencies through globals.
- Prefer named exports when a module exposes multiple related values. Use default exports only when the module clearly has one primary export and the project convention supports them.
- Keep import paths and file-name conventions consistent throughout the repository.
- Do not create catch-all modules such as `helpers.js` or `utils.js` for unrelated behavior. Group code by cohesive responsibility.
- Avoid circular module dependencies. Refactor shared abstractions when modules depend on each other in both directions.
- Keep initialization side effects out of reusable modules when practical. Export functions or classes and let the application entry point perform startup work.
- Dependencies SHOULD be declared explicitly in `package.json` and locked with the repository's chosen lock file.
- Remove unused dependencies and imports.

### Comments and documentation

- Comments SHOULD explain **why**, constraints, risks, or unusual decisions.
- Do not write comments that merely restate the code.
- Public libraries and externally consumed APIs SHOULD use JSDoc or equivalent API documentation where types, contracts, side effects, thrown errors, or usage are not obvious.
- Temporary workarounds MUST include the reason, tracking reference, and removal condition.
- Commented-out code MUST be removed. Version control already preserves history.
- TODO comments SHOULD be actionable and SHOULD include a tracking reference when the repository uses an issue tracker.
- Complex regular expressions, non-obvious algorithms, protocol rules, and browser-specific workarounds SHOULD include enough explanation for a future maintainer to understand the constraint.

### Formatting and enforcement

- ESLint SHOULD enforce correctness, suspicious patterns, naming rules where practical, and repository-specific code-quality rules.
- Prettier SHOULD own routine formatting decisions such as indentation, line wrapping, quote normalization, and whitespace.
- `.editorconfig` SHOULD define basic editor-independent settings such as character encoding, line endings, indentation, and final newlines.
- Formatting rules SHOULD be automated rather than debated during code review.
- Linting and formatting checks SHOULD run in continuous integration.
- New code SHOULD not introduce lint warnings unless a specific suppression is justified with a comment.
- Rule suppressions such as `eslint-disable` SHOULD be narrow in scope and SHOULD include a reason when the justification is not obvious.
