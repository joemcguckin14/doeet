module.exports = {
  include: ['**/*.ts'],
  exclude: ['**/*.spec.ts'],
  all: true,
  extension: ['.ts', '.tsx'],
  reporter: ['lcov', 'text-summary', 'html']
};
