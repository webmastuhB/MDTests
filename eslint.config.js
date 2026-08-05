import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

const ignoredPaths = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/bin/**',
  '**/obj/**',
  '**/vendor/**',
  '**/wwwroot/lib/**',
];

export default defineConfig([
  {
    ignores: ignoredPaths,
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,mjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
    },

    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },

    rules: {
      // Naming: normal identifiers use camelCase; ESLint intentionally permits
      // ALL_UPPER constants, matching the module-level constant convention.
      camelcase: [
        'error',
        {
          properties: 'always',
          ignoreDestructuring: false,
          ignoreImports: false,
          ignoreGlobals: false,
        },
      ],

      // Constructor calls use PascalCase names.
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: true,
          properties: true,
        },
      ],

      // async is already visible in JavaScript; do not carry C#'s Async suffix
      // convention into JavaScript function/method names.
      'no-restricted-syntax': [
        'error',
        {
          selector: "FunctionDeclaration[async=true][id.name=/Async$/]",
          message: 'Async JavaScript functions should not use an Async suffix.',
        },
        {
          selector: "MethodDefinition[value.async=true][key.name=/Async$/]",
          message: 'Async JavaScript methods should not use an Async suffix.',
        },
        {
          selector: "VariableDeclarator[id.name=/Async$/][init.async=true]",
          message: 'Async JavaScript functions should not use an Async suffix.',
        },
      ],

      // Declarations and language usage.
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-implicit-globals': 'error',
      'no-duplicate-imports': 'error',
      'prefer-template': 'error',
      'prefer-rest-params': 'error',
      'prefer-object-spread': 'warn',

      // Security / dynamic-code restrictions.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-extend-native': 'error',
      'no-with': 'error',

      // Error handling and promises.
      'no-useless-catch': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-promise-executor-return': 'error',

      // Readability / maintainability approximations. These are warnings because
      // the written standards call for judgment rather than absolute bans.
      'max-depth': ['warn', 3],
      'no-param-reassign': ['warn', { props: true }],
      'no-return-assign': ['warn', 'always'],
    },
  },

  // CommonJS is supported only for legacy/tooling files. New application code
  // should use ES modules per the standards.
  {
    files: ['**/*.cjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
]);
