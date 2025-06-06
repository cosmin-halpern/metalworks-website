module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$ ': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$ ': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json',
    }],
  },
}; 