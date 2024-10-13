module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'next/core-web-vitals', 'next/typescript', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'next/core-web-vitals',
        'prettier',
      ],
    },
  ],
  rules: {
    '@typescript-eslint/no-misused-promises': 'false',
    '@typescript-eslint/no-unsafe-member-access': 'false',
    '@typescript-eslint/no-unsafe-argument': 'false',
    '@typescript-eslint/no-unsafe-return': 'false',
  },
};

// '@typescript-eslint/no-misused-promises': 'false',
// '@typescript-eslint/no-unsafe-member-access': 'false',
// '@typescript-eslint/no-unsafe-argument': 'false',
// '@typescript-eslint/no-unsafe-return': 'false',
