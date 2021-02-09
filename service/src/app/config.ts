import * as fs from 'fs';

const configLocation = process.env.CONFIG_PATH || 'config.json';
export const config = JSON.parse(fs.readFileSync(configLocation).toString());

export const serviceConfig = config.serviceConfig;
