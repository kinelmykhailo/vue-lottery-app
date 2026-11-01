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
    // "Modal", "Logo" — свідомі винятки (за назвами компонентів у лабораторній роботі);
    // інші компоненти проєкту залишаються багатослівними, як і вимагає правило.
    'vue/multi-word-component-names': ['error', { ignores: ['Modal', 'Logo'] }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}
