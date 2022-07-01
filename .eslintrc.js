module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false
    },
    extends: [
        // 'eslint:recommended',
        // 'plugin:vue/essential',
        // 'plugin:@typescript-eslint/recommended',
        '@nuxtjs/eslint-config-typescript',
        'plugin:prettier/recommended'
    ],
    // plugins: ['prettier', 'vue', '@typescript-eslint'],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        'prettier/prettier': 'off',
        'max-len': [1, { code: 120, tabWidth: 4, ignoreUrls: true }],
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/multi-word-component-names': [
            'error',
            {
                ignores: ['Login']
            }
        ]
    }
}
