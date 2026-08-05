# CSS coding standards

Consistent CSS conventions improve readability, maintainability, reuse, accessibility, and reduce unintended styling interactions. These standards apply to application stylesheets, component styles, responsive layouts, and shared design-system CSS.

### Naming

- Use `kebab-case` for class names: `.order-summary`, `.navigation-item`, `.is-active`.
- Class names SHOULD describe purpose or component responsibility rather than visual appearance. Prefer `.validation-message` over `.red-text`.
- Avoid overly generic names such as `.box`, `.item`, `.thing`, `.left`, and `.big` unless their meaning is genuinely clear within a tightly scoped component.
- State classes SHOULD describe a condition and SHOULD use a consistent prefix such as `is-`, `has-`, or `can-`: `.is-active`, `.has-error`, `.is-disabled`.
- JavaScript hook classes SHOULD be separate from styling classes when practical. A prefix such as `js-` MAY be used for behavior-only selectors: `.js-menu-toggle`.
- Custom properties MUST begin with `--` and SHOULD use descriptive `kebab-case`: `--color-primary`, `--spacing-large`, `--dialog-max-width`.
- Reusable design tokens SHOULD use semantic names when possible: `--color-danger` instead of `--red-600` when the value represents a business/UI purpose.
- Component-specific custom properties SHOULD include the component name when doing so avoids ambiguity: `--card-padding`, `--navigation-height`.
- Avoid encoding implementation details unnecessarily. Prefer `.user-list` over `.user-flex-container`.
- Avoid naming classes after a specific HTML element when the styling concept may be reusable. Prefer `.primary-action` over `.blue-button` or `.submit-anchor`.

```css
:root {
    --color-primary: #005ea8;
    --color-danger: #b42318;
    --spacing-small: 0.5rem;
    --spacing-medium: 1rem;
    --border-radius-medium: 0.375rem;
}

.order-summary {
    padding: var(--spacing-medium);
}

.order-summary__status {
    font-weight: 600;
}

.order-summary__status.is-active {
    color: var(--color-primary);
}
```

### Formatting

- Use four spaces for indentation.
- Put one selector per line when a rule contains multiple selectors.
- Put one declaration per line.
- Include a space after the colon in declarations.
- Include a space before the opening brace.
- Place the closing brace on its own line.
- End every declaration with a semicolon, including the final declaration in a block.
- Use lowercase for property names, pseudo-classes, pseudo-elements, and hexadecimal values.
- Prefer shorthand properties only when they remain clear and do not unintentionally reset related values.
- Do not compress production source files manually. Minification SHOULD be handled by the build/deployment process.
- Use blank lines to separate logical groups of rules or components.
- Formatting rules SHOULD be enforced automatically with Prettier, Stylelint, or equivalent repository tooling.

```css
.customer-card,
.order-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #d0d5dd;
    border-radius: 0.375rem;
}
```

### Selectors and specificity

- Prefer class selectors for application styling.
- Avoid ID selectors for styling. IDs SHOULD primarily identify unique document elements or support scripting/accessibility relationships.
- Avoid styling application behavior directly through element IDs: `#mainMenu`, `#customerForm`.
- Keep selector specificity as low as practical.
- Avoid deeply nested selectors. A selector SHOULD normally contain no more than two or three meaningful levels.
- Do not duplicate DOM structure unnecessarily in selectors.
- Avoid qualifying classes with element names unless the element type is part of the requirement. Prefer `.navigation-item` over `li.navigation-item`.
- Avoid broad descendant selectors that unintentionally affect nested components.
- Avoid universal selectors such as `*` in component rules unless the behavior is deliberate and scoped.
- Avoid `!important`. It MAY be used only when overriding CSS outside the application's control or when a documented utility architecture explicitly requires it.
- Do not increase specificity merely to defeat another rule. Refactor the selector or stylesheet structure instead.
- Pseudo-classes SHOULD represent behavior or state where appropriate: `:hover`, `:focus-visible`, `:disabled`, `:checked`.
- Use `:where()` when intentionally grouping selectors without increasing specificity.

```css
/* Avoid. */
#mainContent .customer-list ul li.customer-item a.customer-link {
    color: #005ea8 !important;
}

/* Prefer. */
.customer-link {
    color: var(--color-primary);
}
```

### Component structure

- Styles SHOULD be organized around components, features, or clear UI responsibilities rather than arbitrary property categories.
- A component SHOULD own the styles required for its internal presentation.
- Avoid selectors that depend heavily on the component's location in the page.
- A reusable component SHOULD render correctly without requiring a specific parent selector unless that dependency is intentional.
- Modifier/state styles SHOULD extend a base component rather than duplicate the component's declarations.
- Teams MAY use BEM or another structured naming convention for complex component libraries, but the convention MUST be applied consistently.
- When BEM is used, follow the pattern `.block`, `.block__element`, `.block--modifier`.
- Do not create a new class for every declaration merely to imitate inline styles unless the project has deliberately adopted a utility-first architecture.
- Avoid monolithic stylesheets. Split large codebases by component, feature, layer, or other coherent responsibility.

```css
.notification {
    padding: 1rem;
    border-radius: 0.375rem;
}

.notification__title {
    margin-block-end: 0.5rem;
    font-weight: 700;
}

.notification--error {
    border: 1px solid var(--color-danger);
}
```

### CSS organization and cascade

- Establish a predictable stylesheet order and keep it consistent across the application.
- Global styles SHOULD be limited to genuine application-wide defaults such as typography, base colors, and box sizing.
- Component rules SHOULD not rely on accidental source-order behavior.
- Use cascade layers (`@layer`) when they improve control of large applications or third-party styles.
- When cascade layers are used, define their order centrally and keep responsibilities clear, for example: `reset`, `base`, `components`, `utilities`, `overrides`.
- Third-party CSS SHOULD be isolated from application overrides where practical.
- Overrides SHOULD be located intentionally and SHOULD explain why the base rule cannot be changed.
- Avoid repeated declarations across unrelated selectors. Extract a shared abstraction only when the styles represent the same conceptual behavior.

```css
@layer reset, base, components, utilities;

@layer base {
    body {
        margin: 0;
        font-family: system-ui, sans-serif;
    }
}

@layer components {
    .primary-button {
        padding: 0.625rem 1rem;
    }
}
```

### Properties and values

- Prefer relative units such as `rem`, `em`, `%`, `vw`, `vh`, `dvh`, and fractional Grid units when they improve adaptability.
- Use pixels where fixed device-independent sizing is appropriate, such as borders, small icons, or precise visual constraints.
- Font sizes SHOULD generally use `rem` so user font-size preferences remain effective.
- Avoid fixed heights for content containers unless the design explicitly requires them. Prefer `min-height` when content may grow.
- Avoid magic values. Repeated or meaningful design values SHOULD be represented by custom properties or documented component constants.
- Use unitless `line-height` where practical.
- Use `0` rather than `0px`, `0rem`, or another unit when the unit provides no meaning.
- Use modern color syntax consistently within a project. Do not mix formats without reason.
- Prefer semantic custom properties for recurring colors, spacing, typography, borders, and other design-system values.
- Avoid hard-coded colors when an existing design token represents the same purpose.
- Prefer logical properties such as `margin-inline`, `padding-block`, `inset-inline-start`, and `border-inline-start` when they improve support for different writing directions.

```css
:root {
    --content-max-width: 75rem;
    --spacing-page: 1.5rem;
    --line-height-body: 1.5;
}

.page-content {
    width: min(100% - (2 * var(--spacing-page)), var(--content-max-width));
    margin-inline: auto;
    line-height: var(--line-height-body);
}
```

### Layout

- Use normal document flow as the default layout mechanism.
- Use Flexbox for one-dimensional layouts and alignment.
- Use CSS Grid for two-dimensional layouts and structured page/component grids.
- Avoid using absolute positioning for primary page layout.
- Absolute positioning SHOULD be reserved for elements whose relationship to a positioned ancestor is intentional.
- Do not use tables for visual page layout.
- Avoid excessive negative margins and unexplained transforms used solely to force elements into position.
- Prefer `gap` for spacing between Grid/Flex items instead of child-specific margins when the spacing belongs to the container layout.
- Avoid fixed widths when a flexible `max-width`, Grid, Flexbox, or responsive expression expresses the requirement better.
- Use `box-sizing: border-box` application-wide unless a specific requirement justifies otherwise.

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
}

.dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 1rem;
}
```

### Responsive design

- Responsive behavior SHOULD be designed intentionally rather than added as a final correction step.
- Prefer a mobile-first approach: define the base experience for smaller viewports, then add enhancements with `min-width` media queries.
- Breakpoints SHOULD be based on where the layout requires adjustment, not on specific device models.
- Reusable breakpoint values SHOULD be documented or represented consistently through project tooling/conventions.
- Avoid unnecessary media queries when Grid, Flexbox, `min()`, `max()`, `clamp()`, or intrinsic sizing can solve the layout naturally.
- Images, video, and embedded content SHOULD not overflow their containers.
- Avoid relying exclusively on viewport width for component behavior when container queries better represent a component's available space.
- Container queries SHOULD be considered for reusable components whose layout depends on their containing region rather than the full viewport.

```css
.page-navigation {
    display: block;
}

@media (min-width: 48rem) {
    .page-navigation {
        display: flex;
        gap: 1rem;
    }
}

.card-grid {
    container-type: inline-size;
}

@container (min-width: 36rem) {
    .card-grid__item {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
}
```

### Typography

- Define an application-wide font stack intentionally.
- Font sizes, weights, and line heights SHOULD come from a consistent typographic scale when the application has a design system.
- Avoid using font size alone to communicate semantic hierarchy; use appropriate HTML headings and structure.
- Do not disable user zoom.
- Avoid text sizes that become unreadable on small screens.
- Avoid fixed line heights expressed in pixels for normal body text.
- Long-form text SHOULD have a reasonable line length; excessively wide text blocks reduce readability.

### Accessibility

- CSS MUST NOT remove visible keyboard focus without providing an equally visible replacement.
- Prefer `:focus-visible` for custom keyboard-focus presentation where supported by the application's browser requirements.
- Color MUST NOT be the sole means of communicating status or required action.
- Text and meaningful UI elements MUST maintain sufficient contrast for the application's accessibility requirements.
- Hover-only interactions MUST have an equivalent keyboard/touch-accessible mechanism.
- Respect user motion preferences with `prefers-reduced-motion` when animations or transitions are significant.
- Avoid animations that flash rapidly or create unnecessary motion.
- Content required for understanding or operating the application SHOULD NOT exist only in generated CSS content.
- Hiding content visually MUST use a technique appropriate to the requirement. `display: none` and `visibility: hidden` also remove content from normal interaction/accessibility exposure.
- Do not use CSS to rearrange content into a visual order that conflicts significantly with the DOM reading/focus order.

```css
.primary-button:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto;
        transition-duration: 0.01ms;
        animation-duration: 0.01ms;
        animation-iteration-count: 1;
    }
}
```

### Custom properties and design tokens

- Use CSS custom properties for values intentionally shared across components or themes.
- Global design tokens SHOULD normally be declared in `:root` or an explicit theme scope.
- Component custom properties SHOULD be declared as close as practical to the component that owns them.
- Custom properties SHOULD represent meaningful concepts rather than arbitrary aliases.
- Do not create custom properties for every literal value. Extract values when reuse, theming, consistency, or semantic meaning justifies it.
- Fallback values SHOULD be used when a component can operate safely without a globally defined token.
- Theme overrides SHOULD modify tokens where possible instead of duplicating complete component rule sets.

```css
:root {
    --surface-background: #ffffff;
    --surface-text: #101828;
}

[data-theme="dark"] {
    --surface-background: #101828;
    --surface-text: #f2f4f7;
}

.application-shell {
    color: var(--surface-text);
    background: var(--surface-background);
}
```

### Images and media

- Responsive images and media SHOULD remain within the width of their containing element.
- Use `object-fit` when image cropping/scaling behavior is part of the design.
- Do not use CSS background images for meaningful content that requires alternative text.
- Decorative background images SHOULD not convey information required to understand the interface.
- Avoid embedding very large images directly into CSS unless the build strategy and performance impact justify it.

```css
img,
video,
svg {
    max-width: 100%;
}

img,
video {
    height: auto;
}
```

### Performance and maintainability

- Prefer clear, maintainable selectors over premature micro-optimization.
- Avoid excessive duplication of large declaration blocks.
- Remove unused rules when features are removed. Version control preserves history.
- Avoid adding CSS solely to compensate for invalid or unnecessarily complex HTML when the markup can be corrected instead.
- Do not depend on undocumented browser quirks.
- Vendor prefixes SHOULD be generated by build tooling such as Autoprefixer when required by supported browsers rather than maintained manually.
- Avoid large amounts of application-wide CSS when styles can be scoped to a feature or component.
- Third-party frameworks SHOULD be configured or extended through their documented mechanisms rather than broadly overridden with high-specificity selectors.
- New browser features SHOULD be used when they meet the application's supported-browser requirements and improve clarity or maintainability.
- Progressive enhancement SHOULD be preferred when an optional CSS feature can improve the experience without making the baseline unusable.

### Framework and library integration

- When Bootstrap, another CSS framework, or a component library is used, prefer its documented classes, variables, utilities, and extension points before creating duplicate implementations.
- Do not override framework rules globally unless the change is intentionally application-wide.
- Application-specific classes SHOULD represent application concepts rather than copying framework internals.
- Avoid long chains of utility classes when a repeated visual pattern has become a stable application component; extract a meaningful component abstraction where appropriate.
- Framework customization SHOULD be centralized so upgrades do not require searching the entire application for overrides.
- Do not modify third-party library source files directly.

### Comments and documentation

- Comments SHOULD explain **why**, constraints, browser requirements, accessibility considerations, or unusual layout decisions.
- Do not write comments that merely restate the selector or declaration.
- Major stylesheet sections MAY use clear section comments when they improve navigation.
- Complex workarounds MUST document the reason they exist.
- Browser-specific workarounds MUST identify the compatibility issue and SHOULD include a removal condition when known.
- Temporary workarounds MUST include the reason, tracking reference when available, and the condition under which they can be removed.
- Commented-out CSS MUST be removed. Version control preserves history.
- `!important`, unusually high specificity, deliberate overflow clipping, and other exceptional techniques SHOULD include a comment when their reason is not obvious.

### Example

```css
:root {
    --color-primary: #005ea8;
    --color-danger: #b42318;
    --color-border: #d0d5dd;
    --spacing-small: 0.5rem;
    --spacing-medium: 1rem;
    --content-max-width: 75rem;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: system-ui, sans-serif;
    line-height: 1.5;
}

.page-content {
    width: min(100% - 2rem, var(--content-max-width));
    margin-inline: auto;
}

.order-card {
    display: grid;
    gap: var(--spacing-medium);
    padding: var(--spacing-medium);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
}

.order-card__header {
    display: flex;
    gap: var(--spacing-small);
    align-items: center;
    justify-content: space-between;
}

.order-card__status {
    font-weight: 600;
}

.order-card__status.is-active {
    color: var(--color-primary);
}

.order-card__status.has-error {
    color: var(--color-danger);
}

.order-card a:focus-visible,
.order-card button:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

@media (min-width: 48rem) {
    .order-card {
        grid-template-columns: 2fr 1fr;
    }
}
```

### Tooling

- Stylelint SHOULD be used to enforce important CSS quality and consistency rules.
- Prettier or equivalent formatting tooling SHOULD enforce mechanical formatting where appropriate.
- CSS linting SHOULD run automatically during development and in continuous integration.
- Build warnings from CSS tooling SHOULD be reviewed rather than ignored indefinitely.
- Browser support SHOULD be defined at the project level and used to drive transpilation/prefixing decisions.
- Automated accessibility testing SHOULD supplement, not replace, manual keyboard and visual review.

### References

- MDN Web Docs — CSS: https://developer.mozilla.org/docs/Web/CSS
- MDN Web Docs — CSS custom properties: https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties
- MDN Web Docs — CSS specificity: https://developer.mozilla.org/docs/Web/CSS/CSS_cascade/Specificity
- MDN Web Docs — CSS Grid Layout: https://developer.mozilla.org/docs/Web/CSS/CSS_grid_layout
- MDN Web Docs — CSS Flexible Box Layout: https://developer.mozilla.org/docs/Web/CSS/CSS_flexible_box_layout
- Stylelint: https://stylelint.io/
- Prettier — CSS: https://prettier.io/docs/en/options.html
