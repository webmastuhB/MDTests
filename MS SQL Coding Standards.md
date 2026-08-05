# Microsoft SQL Server / T-SQL coding standards

Consistent T-SQL conventions improve readability, reviewability, maintainability, and reduce the risk of subtle production errors. These standards apply to Microsoft SQL Server queries, stored procedures, functions, views, triggers, and database scripts.

### Naming

- Use `PascalCase` for tables, views, stored procedures, functions, columns, constraints, and other application-defined database objects.
- Use `camelCase` for local variables and parameters, prefixed with `@`: `@customerId`, `@startDate`, `@maximumRowCount`.
- Boolean/`BIT` values SHOULD describe a true condition: `IsActive`, `HasPermission`, `CanRetry`.
- Table and view names SHOULD be descriptive nouns: `Customer`, `SalesOrder`, `SalesOrderItem`.
- Stored procedure names SHOULD describe an action or query: `GetCustomerOrders`, `CreateOrder`, `UpdateShipmentStatus`.
- User-defined stored procedures MUST NOT use the `sp_` prefix. SQL Server reserves that prefix for system stored procedures.
- Avoid vague names such as `Data`, `Info`, `Temp`, `Misc`, `Thing`, and `Value` unless the meaning is genuinely clear from context.
- Avoid unnecessary abbreviations. Prefer `CustomerAddress` over `CustAddr`.
- Include units when ambiguity is possible: `TimeoutMilliseconds`, `DistanceMeters`, `FileSizeBytes`.
- Avoid encoding implementation details unnecessarily: prefer `Customer` over `CustomerTable` and `SalesOrders` over `OrderRows`.
- Avoid spaces, punctuation, reserved words, and other identifiers that require delimiters such as brackets.
- Schema names SHOULD describe ownership or functional grouping. Object references SHOULD normally be schema-qualified: `sales.SalesOrder`, `dbo.Customer`.

```sql
CREATE TABLE sales.SalesOrder
(
    OrderId BIGINT NOT NULL,
    CustomerId BIGINT NOT NULL,
    OrderDate DATETIME2(0) NOT NULL,
    IsActive BIT NOT NULL,
    CONSTRAINT PK_Order PRIMARY KEY (OrderId)
);
GO

CREATE OR ALTER PROCEDURE sales.GetCustomerOrders
    @customerId BIGINT,
    @startDate DATETIME2(0)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.OrderId,
        o.OrderDate,
        o.IsActive
    FROM sales.SalesOrder AS o
    WHERE o.CustomerId = @customerId
      AND o.OrderDate >= @startDate
    ORDER BY o.OrderDate;
END;
GO
```

### Query structure and formatting

- Write T-SQL keywords in `UPPERCASE`: `SELECT`, `FROM`, `WHERE`, `JOIN`, `ORDER BY`, `BEGIN`, `END`.
- Terminate T-SQL statements with semicolons.
- Place major clauses on separate lines.
- List selected columns explicitly and normally place one column per line for nontrivial queries.
- Do not use `SELECT *` in production application queries, views, stored procedures, or reusable database code.
- Use `AS` for table aliases and column aliases when it improves clarity.
- Use short but meaningful table aliases: `c` for `Customer`, `o` for `Order`. Avoid meaningless aliases such as `a`, `b`, and `x` when several tables are involved.
- Qualify column references with aliases in queries involving multiple tables.
- Use explicit `JOIN` syntax. Do not express joins through comma-separated tables in the `FROM` clause.
- Put each `JOIN` on its own line and keep its `ON` predicate with the join.
- Prefer guard conditions and straightforward predicates over deeply nested expressions.
- Parenthesize compound Boolean expressions when doing so makes precedence and intent obvious.
- Use `BEGIN...END` for multi-statement control-flow blocks and SHOULD use it even for single-statement branches when future modification is likely.
- Keep indentation consistent. Four spaces is the preferred indentation level.
- Keep one logical statement per line where practical.

```sql
SELECT
    c.CustomerId,
    c.CustomerName,
    o.OrderId,
    o.OrderDate
FROM sales.Customer AS c
INNER JOIN sales.SalesOrder AS o
    ON o.CustomerId = c.CustomerId
WHERE c.IsActive = 1
  AND o.OrderDate >= @startDate
ORDER BY
    c.CustomerName,
    o.OrderDate DESC;
```

### T-SQL usage

- Prefer set-based operations over cursors and row-by-row processing.
- Use `const`-like named values through variables, parameters, lookup tables, configuration, or appropriate constraints instead of repeating unexplained literal values.
- Avoid magic numbers and magic strings when the value represents a business rule or configuration value.
- Use `CASE` when it clearly expresses conditional value selection; do not force complex business workflows into deeply nested `CASE` expressions.
- Use Common Table Expressions (CTEs) when they improve readability, especially for staged transformations or recursive queries.
- Do not use a CTE merely to make a simple query appear more structured.
- Prefer `EXISTS` when the requirement is to determine whether a related row exists.
- Use `IN` when comparing against a small, clear set of values or when it best expresses intent.
- Use `UNION ALL` unless duplicate elimination provided by `UNION` is actually required.
- Use `COALESCE` or `ISNULL` intentionally; understand their type and nullability behavior rather than treating them as interchangeable formatting conveniences.
- Use `IS NULL` and `IS NOT NULL`. Never compare `NULL` using `=` or `<>`.
- Avoid implicit type conversions. Parameters, variables, columns, and comparison values SHOULD use compatible data types.
- Prefer Unicode string types (`NVARCHAR`, `NCHAR`) when data can contain arbitrary human-language text.
- Specify string lengths explicitly: `VARCHAR(100)`, `NVARCHAR(200)`.
- Avoid `VARCHAR(MAX)` and `NVARCHAR(MAX)` unless the data can genuinely exceed normal bounded lengths.
- Prefer `DATE`, `TIME`, `DATETIME2`, or `DATETIMEOFFSET` for new development. Avoid legacy `DATETIME` for new schema design unless compatibility requires it.
- Use unambiguous date values and parameterized date inputs. ISO-oriented formats such as `YYYY-MM-DD` SHOULD be used when date literals are unavoidable.

### Joins and data retrieval

- Select only the columns required by the caller.
- Use `INNER JOIN` when a matching related row is required.
- Use `LEFT JOIN` only when unmatched rows from the left side are intentionally required.
- Do not use `DISTINCT` merely to hide duplicate rows caused by an incorrect join.
- Do not add joins whose columns or existence are not required by the query.
- Avoid scalar subqueries executed repeatedly per row when a set-based join or aggregation expresses the requirement more clearly and efficiently.
- Avoid applying functions to indexed columns in search predicates when an equivalent sargable predicate can be written.
- Avoid leading-wildcard searches such as `LIKE '%text'` on large tables unless the resulting scan is intentional or specialized indexing/search infrastructure is used.
- Use deterministic ordering whenever the caller depends on row order. A result set has no guaranteed order without `ORDER BY`.
- `TOP` queries that depend on which rows are returned MUST include an appropriate `ORDER BY`.

```sql
-- Avoid: applying a function to the searched column.
WHERE CAST(o.OrderDate AS DATE) = @orderDate;

-- Prefer: a range predicate that can make better use of an index.
WHERE o.OrderDate >= @orderDate
  AND o.OrderDate < DATEADD(DAY, 1, @orderDate);
```

### Stored procedures and functions

- Stored procedures SHOULD begin with `SET NOCOUNT ON;` unless affected-row messages are intentionally required by the caller.
- Procedures SHOULD have a clear, cohesive responsibility.
- Avoid procedures controlled by numerous Boolean parameters. They often conceal several unrelated operations inside one procedure.
- Parameters SHOULD have explicit and appropriate data types and lengths.
- Do not accept a string parameter merely to parse arbitrary SQL fragments, lists, sort expressions, or predicates when a structured alternative exists.
- Use table-valued parameters or appropriately designed relational inputs when passing sets of values from applications.
- Return predictable result-set shapes from application-facing procedures.
- Avoid returning unrelated result sets from the same procedure unless the API explicitly requires them.
- User-defined functions SHOULD be free of unnecessary complexity and SHOULD NOT be used where their invocation pattern creates avoidable row-by-row work.
- Use `CREATE OR ALTER` for programmable objects when the supported SQL Server version allows it and deployment conventions permit it.

### Transactions and error handling

- Keep transactions as short as practical.
- Do not begin a transaction earlier than necessary or leave it open while waiting for application/user interaction.
- Every explicit transaction MUST have a clear commit and rollback path.
- Procedures that manage explicit transactions SHOULD generally use `TRY...CATCH` error handling.
- Consider `SET XACT_ABORT ON;` for procedures that perform transactional modifications so runtime errors do not leave partially completed transactions open.
- Use `THROW` for new error-handling code rather than `RAISERROR` unless compatibility requirements justify otherwise.
- In a `CATCH` block, inspect transaction state when necessary and roll back transactions that cannot be committed safely.
- Do not silently swallow database errors.
- Do not commit partial work after an error unless partial completion is an explicit business requirement.

```sql
CREATE OR ALTER PROCEDURE sales.CreateOrder
    @customerId BIGINT,
    @orderDate DATETIME2(0)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO sales.SalesOrder
        (
            CustomerId,
            OrderDate,
            IsActive
        )
        VALUES
        (
            @customerId,
            @orderDate,
            1
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        THROW;
    END CATCH;
END;
GO
```

### Data modification and safety

- `UPDATE` and `DELETE` statements MUST have an intentional scope. Review the `WHERE` clause carefully before executing ad hoc changes against shared or production data.
- For significant ad hoc changes, first run the equivalent `SELECT` using the same predicate and confirm the affected rows.
- Use explicit column lists with `INSERT` statements. Do not depend on table column order.
- Avoid `MERGE` unless the team has deliberately chosen it and its concurrency and correctness behavior has been reviewed for the specific scenario. Separate `INSERT`, `UPDATE`, and `DELETE` statements are often easier to reason about.
- Do not use `NOLOCK` as a generic performance fix. Dirty, missing, or duplicated reads may be unacceptable to the business requirement.
- Do not disable constraints, triggers, or referential integrity casually to make a script succeed.
- Schema changes and data migrations SHOULD be repeatable or have clearly documented deployment assumptions.
- Destructive deployment scripts SHOULD fail safely when prerequisites are not satisfied.

### Performance

- Optimize for correctness and clarity first, then validate performance using actual workload evidence.
- Examine execution plans for expensive or frequently executed queries.
- Indexes SHOULD support actual access patterns; do not add indexes solely because a single test query suggests one.
- Avoid unnecessary scans of large tables.
- Write search predicates so indexes can be used effectively where practical.
- Avoid unnecessary sorting, duplicate elimination, and repeated calculations.
- Avoid returning more rows or columns than the caller needs.
- Pagination queries MUST have deterministic ordering.
- Use `EXISTS` rather than retrieving data solely to determine whether rows exist.
- Do not assume a query is efficient because it is short or inefficient because it is long; measure it.
- Parameter-sensitive behavior and parameter sniffing SHOULD be diagnosed from execution evidence before applying hints or recompilation strategies.
- Query hints SHOULD be exceptional and documented. Do not use them to compensate for an uninvestigated schema, statistics, indexing, or query-design problem.

### Dynamic SQL and security

- Application input MUST be parameterized. Never concatenate untrusted values into executable SQL.
- Dynamic SQL SHOULD be used only when the structure of the query genuinely must be dynamic.
- Use `sys.sp_executesql` with parameters for dynamic values.
- Object names that must be dynamic SHOULD be validated against an allowed set and safely delimited with `QUOTENAME` where appropriate.
- Database principals SHOULD receive only the permissions required for their responsibilities.
- Applications SHOULD NOT normally connect using highly privileged accounts such as `sysadmin` or database owner credentials.
- Sensitive data MUST NOT be written to logs, diagnostic output, or error messages without an explicit requirement and appropriate protection.

```sql
-- Avoid.
SET @sql = N'SELECT CustomerId FROM sales.Customer WHERE Email = '''
    + @email
    + N'''';

-- Prefer.
SET @sql = N'
    SELECT CustomerId
    FROM sales.Customer
    WHERE Email = @email;';

EXEC sys.sp_executesql
    @sql,
    N'@email NVARCHAR(320)',
    @email = @email;
```

### Comments and documentation

- Comments SHOULD explain **why**, business constraints, risks, assumptions, or unusual implementation decisions.
- Do not write comments that merely restate the SQL.
- Complex queries SHOULD document non-obvious business rules and intentional performance tradeoffs.
- Stored procedures and functions exposed as stable application interfaces SHOULD document their purpose, important parameters, outputs, and unusual side effects.
- Temporary workarounds MUST include the reason, tracking reference when available, and the condition under which the workaround can be removed.
- Commented-out SQL MUST be removed. Version control preserves history.
- Query hints, unusual locking behavior, intentionally non-sargable predicates, and deliberate full scans SHOULD include a comment explaining why they are appropriate.

### Example

```sql
CREATE OR ALTER PROCEDURE sales.GetActiveCustomerOrders
    @customerId BIGINT,
    @startDate DATETIME2(0),
    @maximumRowCount INT = 100
AS
BEGIN
    SET NOCOUNT ON;

    IF @customerId <= 0
    BEGIN
        THROW 50001, 'CustomerId must be greater than zero.', 1;
    END;

    IF @maximumRowCount <= 0
    BEGIN
        THROW 50002, 'MaximumRowCount must be greater than zero.', 1;
    END;

    SELECT TOP (@maximumRowCount)
        o.OrderId,
        o.CustomerId,
        o.OrderDate,
        o.IsActive
    FROM sales.SalesOrder AS o
    WHERE o.CustomerId = @customerId
      AND o.IsActive = 1
      AND o.OrderDate >= @startDate
    ORDER BY o.OrderDate DESC;
END;
GO
```

### References

- Microsoft Learn — Transact-SQL syntax conventions: https://learn.microsoft.com/sql/t-sql/language-elements/transact-sql-syntax-conventions-transact-sql
- Microsoft Learn — T-SQL naming issues / SQL code analysis: https://learn.microsoft.com/sql/tools/sql-database-projects/concepts/sql-code-analysis/t-sql-naming-issues
- Microsoft Learn — SET NOCOUNT: https://learn.microsoft.com/sql/t-sql/statements/set-nocount-transact-sql
- Microsoft Learn — SET XACT_ABORT: https://learn.microsoft.com/sql/t-sql/statements/set-xact-abort-transact-sql
- Microsoft Learn — TRY...CATCH: https://learn.microsoft.com/sql/t-sql/language-elements/try-catch-transact-sql
- Microsoft Learn — datetime: https://learn.microsoft.com/sql/t-sql/data-types/datetime-transact-sql
