module.exports = {
  root: true,
  extends: ['1stg/react'],
  rules: {
    'prettier/prettier': [
      2,
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
      },
    ],
  },
}
