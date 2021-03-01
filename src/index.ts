import fs from 'fs';
import fastify from 'fastify';
import { Config } from './common/config';
import { PrismaClient } from '@prisma/client';
import * as Banner from './common/banner';
import { registerRootEndpoints } from './routes';
import fastifyCors from 'fastify-cors';

export const packageJson = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));
export const config = JSON.parse(fs.readFileSync('config.json', { encoding: 'utf-8' })) as Config;

const env = process.env.NODE_ENV || 'development';

export const isDevelopment = env === 'development';
export const prisma = new PrismaClient();

Banner.showBanner();
Banner.devModeCheck();

const app = fastify({
  logger: {
    prettyPrint: true,
  },
  trustProxy: config.fastify.proxy
    ? config.fastify.proxy.allowedHosts
      ? config.fastify.proxy.allowedHosts
      : true
    : false,
});

app.register(fastifyCors, {
  origin: true,
});

console.log('[Startup] Add Authentication Hook for Fastify...');

console.log('[Startup] Starting up fastify...');
registerRootEndpoints(app);

if (typeof config.fastify.listen === 'string') {
  if (fs.existsSync(config.fastify.listen)) {
    fs.unlinkSync(config.fastify.listen);
  }
}

app.listen(config.fastify.listen);
