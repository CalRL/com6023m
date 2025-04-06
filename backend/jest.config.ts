import { Config } from 'jest';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};

export default config;
