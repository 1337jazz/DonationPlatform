module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'consistent-return': 0,
    'comma-dangle': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-cond-assign': 0,
    'no-mixed-operators': 0,
    'no-return-assign': 0,
    'no-sequences': 0
  },
};
