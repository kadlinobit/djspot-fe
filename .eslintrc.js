module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        'plugin:@typescript-eslint/recommended',
        '@nuxtjs/eslint-config-typescript',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'prettier/prettier': 'error',
        // 'max-len': [1, { code: 120, tabWidth: 4, ignoreUrls: true }],
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/multi-word-component-names': 'off'
    }
}
