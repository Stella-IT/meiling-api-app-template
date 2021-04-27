import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { FastifyRequestWithUser } from '..';
import { APIError, sendError } from '../../../common/error';

const adminHandler = (app: FastifyInstance, opts: FastifyPluginOptions, done: () => void): void => {
  app.addHook('onRequest', (req_, rep, next) => {
    const req = req_ as FastifyRequestWithUser;
    if (!req.isAdmin) {
      sendError(rep, APIError.INVALID_TOKEN, 'invalid token');
      return;
    }

    next();
  });

  app.get('/', (req, rep) => {
    rep.send({
      version: 1,
      admin: true,
    });
  });

  done();
};

export default adminHandler;
