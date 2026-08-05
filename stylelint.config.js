/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],

  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/bin/**',
    '**/obj/**',
    '**/vendor/**',
    '**/wwwroot/lib/**',
  ],

  rules: {
    // kebab-case with optional BEM __element / --modifier suffixes.
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:(?:__|--)[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      {
        message:
          'Use descriptive kebab-case class names, optionally with BEM __element or --modifier suffixes.',
      },
    ],

    // CSS custom properties are descriptive kebab-case. The leading -- is CSS syntax
    // and is not part of the value checked by this Stylelint rule.
    'custom-property-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$',
      {
        message: 'Use descriptive kebab-case custom property names.',
      },
    ],

    // The standards strongly prefer classes and low specificity. These are warnings
    // because documented framework/third-party exceptions are allowed.
    'selector-max-id': [0, { severity: 'warning' }],
    'selector-max-compound-selectors': [3, { severity: 'warning' }],
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute'],
        severity: 'warning',
      },
    ],
    'declaration-no-important': [true, { severity: 'warning' }],
    'max-nesting-depth': [2, { severity: 'warning' }],

    // Relative typography and unitless line-height are preferred. These remain
    // warnings because the standards explicitly allow justified exceptions.
    'declaration-property-unit-disallowed-list': [
      {
        'font-size': ['px'],
        'line-height': ['px'],
      },
      {
        severity: 'warning',
      },
    ],

    // Vendor prefixes should come from build tooling (for example Autoprefixer),
    // not hand-maintained application CSS.
    'at-rule-no-vendor-prefix': [true, { severity: 'warning' }],
    'media-feature-name-no-vendor-prefix': [true, { severity: 'warning' }],
    'property-no-vendor-prefix': [true, { severity: 'warning' }],
    'selector-no-vendor-prefix': [true, { severity: 'warning' }],
    'value-no-vendor-prefix': [true, { severity: 'warning' }],
  },
};
