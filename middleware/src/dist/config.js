"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMqConfig = exports.corsClientHost = exports.serviceConfig = exports.config = void 0;
const fs = require("fs");
const configLocation = process.env.CONFIG_PATH || 'config.json';
exports.config = JSON.parse(fs.readFileSync(configLocation).toString());
exports.serviceConfig = exports.config.serviceConfig;
exports.corsClientHost = exports.config.corsClientHost;
exports.rabbitMqConfig = exports.config.rabbitMqConfig;
//# sourceMappingURL=config.js.map