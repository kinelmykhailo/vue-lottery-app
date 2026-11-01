/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  plugins: ['boundaries'],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'pages', pattern: 'src/pages/*' },
      { type: 'widgets', pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared', pattern: 'src/shared/*' }
    ],
    'boundaries/ignore': ['**/*.d.ts', '**/*.scss', '**/*.css']
  },
  rules: {
    'vue/multi-word-component-names': ['error', { ignores: ['Modal', 'Logo'] }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',

    // FSD Rules using eslint-plugin-boundaries
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        policies: [
          {
            from: { element: { type: 'app' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['pages', 'widgets', 'features', 'entities', 'shared', 'app']
                  }
                }
              }
            ]
          },
          {
            from: { element: { type: 'pages' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['widgets', 'features', 'entities', 'shared']
                  }
                }
              }
            ]
          },
          {
            from: { element: { type: 'widgets' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['features', 'entities', 'shared']
                  }
                }
              }
            ]
          },
          {
            from: { element: { type: 'features' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['entities', 'shared']
                  }
                }
              }
            ]
          },
          {
            from: { element: { type: 'entities' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['shared']
                  }
                }
              }
            ]
          },
          {
            from: { element: { type: 'shared' } },
            allow: [
              {
                to: {
                  element: {
                    type: ['shared']
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
