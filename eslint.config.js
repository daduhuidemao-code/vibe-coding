import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.config.js',
      'packages/**/node_modules/',
      'packages/**/dist/',
      '.git/',
      '.husky/',
      '*.lock',
      '*.md'
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    ...pluginJs.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      react: pluginReact,
      'react-hooks': pluginReactHooks
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettierConfig
];