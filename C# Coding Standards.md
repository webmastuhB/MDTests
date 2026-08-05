# C# coding standards

Microsoft recommends enforcing consistent C# conventions because consistency improves readability, collaboration, maintenance, and extension of the codebase. A repository-level `.editorconfig` is an appropriate enforcement mechanism.

### Naming

- Use `PascalCase` for classes, records, structs, methods, properties, enums, and public members.
- Use `camelCase` for parameters and local variables.
- Use `_camelCase` for private instance fields.
- Interfaces SHOULD use the `I` prefix: `IOrderRepository`.
- Asynchronous methods SHOULD end in `Async`: `SaveOrderAsync`.
- Boolean names SHOULD describe a true condition: `isActive`, `hasPermission`, `canRetry`.
- Avoid vague names such as `Manager`, `Helper`, `Utility`, `Processor`, `Data`, and `Info` unless the name clearly describes a cohesive responsibility.
- Include units when ambiguity is possible: `timeoutMilliseconds`, `distanceMeters`
- Do not encode implementation types unnecessarily: prefer `customers` over `customerList`.

```csharp
public enum OrderStatus
{
    Pending,
    Shipped
}

public sealed record Customer(
    Guid CustomerId,
    bool IsActive,
    bool HasPermission);

public interface IOrderRepository
{
    Task SaveOrderAsync(
        Order order,
        CancellationToken cancellationToken);
}

public sealed class Order
{
    public Guid OrderId { get; init; }

    public OrderStatus Status { get; private set; }

    public void MarkAsShipped()
    {
        Status = OrderStatus.Shipped;
    }
}

public sealed class OrderShippingService
{
    private readonly IOrderRepository _orderRepository;

    public OrderShippingService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<bool> ShipOrderAsync(
        Order order,
        Customer customer,
        double distanceMeters,
        int timeoutMilliseconds,
        CancellationToken cancellationToken)
    {
        var isActive = customer.IsActive;
        var hasPermission = customer.HasPermission;
        var canShip = distanceMeters > 0 && timeoutMilliseconds > 0;

        if (!isActive || !hasPermission || !canShip)
        {
            return false;
        }

        order.MarkAsShipped();

        await _orderRepository.SaveOrderAsync(
            order,
            cancellationToken);

        return true;
    }
}
```

### Code structure

- Enable nullable reference types.
- Treat compiler warnings and important analyzer warnings as build failures.
- Use braces for control structures, including single-line statements.
- Keep one statement per line.
- Prefer guard clauses over deeply nested conditions.
- Keep methods focused and at one conceptual level.
- Avoid methods with numerous Boolean parameters. They often hide multiple behaviors.
- Avoid large constructors. Many dependencies usually indicate excessive responsibility.
- Avoid mutable static state.
- Avoid `#region` as a substitute for splitting an oversized class.
- Do not use partial classes merely to disguise an excessively large class.

### Language usage

- Use `var` when the assigned type is immediately obvious; use the explicit type when it improves understanding.
- Prefer immutable objects for messages, value objects, configuration, and results.
- Consider records for immutable data-oriented types.
- Use `readonly` where mutation is not required.
- Use pattern matching when it makes business logic clearer—not merely because it is newer syntax.
- Avoid reflection, `dynamic`, and runtime type discovery unless the requirement justifies reduced compile-time safety.
- Avoid magic strings and numbers. Use named constants, enums, value objects, or configuration.
- Do not catch `Exception` unless you can meaningfully handle it or are at an application boundary.
- **Nullable reference types MUST be enabled** solution-wide. A parameter that can't be null is `Customer`; one that can is `Customer?`. Do not suppress with `!` except at a genuinely-checked boundary, with a comment.
- **`var`** SHOULD be used when the type is obvious from the right-hand side; use the explicit type when it aids readability. Be consistent within a file.
- **Records** for immutable data / DTOs / value objects. Classes for entities with identity and behavior.
- **Expression-bodied members** MAY be used for trivial one-liners; don't force them onto anything with branching.
- **Pattern matching and switch expressions** are preferred over long `if/else` ladders on type or state.
- Prefer **immutability**: `readonly` fields, `init`-only setters, and returning new instances over mutating shared state.
- **Guard clauses** over nested conditionals. Return/throw early; keep the happy path at the lowest indentation.
- No "magic" values. Extract literals to named constants or enums.

### Comments and documentation

- Comments SHOULD explain **why**, constraints, risks, or unusual decisions.
- Do not write comments that merely restate the code.
- Public libraries and externally consumed APIs SHOULD have XML documentation.
- Temporary workarounds MUST include the reason, tracking reference, and removal condition.
- Commented-out code MUST be removed. Version control already preserves history.
