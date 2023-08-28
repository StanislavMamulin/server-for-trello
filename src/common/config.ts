import dotenv from 'dotenv';
import path from 'path';
import { IEnvConfig } from './config.interface';

const dotenvConfig = dotenv.config({
    path: path.join(__dirname, '../../.env'),
});

const envConfig = dotenvConfig.parsed as unknown as IEnvConfig;

export { envConfig };
