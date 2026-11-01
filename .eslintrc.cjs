/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // "Modal" — свідомий виняток (так названо компонент у завданні лабораторної
    // роботи); інші компоненти проєкту залишаються багатослівними, як і вимагає правило.
    'vue/multi-word-component-names': ['error', { ignores: ['Modal'] }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}
