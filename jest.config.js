module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 20000, 
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };
  