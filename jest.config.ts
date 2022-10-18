import * as path from 'path'
import type { Config } from 'jest';

const config: Config = {
  //preset: 'foo-bar',
  verbose: false,
  watchman: true,
  rootDir: './src', 
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest"
  }
};

export default config;