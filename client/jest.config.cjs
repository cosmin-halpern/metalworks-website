const { createDefaultPreset } = require('ts-jest');
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ['**/*.test.[jt]s?(x)'],
};
