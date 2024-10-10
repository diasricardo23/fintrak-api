import { fastify, FastifyReply, FastifyRequest } from 'fastify';
import fjwt, { FastifyJWT, JWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import authRoutes from '@/modules/auth/auth.route';
import userRoutes from './modules/user/user.route';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      email: string
    }
  }
}

const PORT = process.env.PORT || 8080;
const server = fastify({ logger: { level: 'info' } });

server.get("/healthcheck", async () => {
  return { status: "OK" };
});

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.status(401).send({ error: 'ERROR_AUTH_UNAUTHORIZED' });
    }

    const decoded = request.jwt.verify<FastifyJWT['user']>(token)
    request.user = decoded
  } catch (err) {
    return reply.status(401).send({ error: 'ERROR_AUTH_UNAUTHORIZED' });
  }
})

server.register(fjwt, { secret: process.env.JWT_SECRET as string })

server.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, next) => {
  request.jwt = server.jwt
  return next()
})

server.register(fCookie, {
  secret: process.env.COOKIE_SECRET as string,
  hook: 'preHandler',
})

server.register(authRoutes, { prefix: "/api/auth" });
server.register(userRoutes, { prefix: "/api/users" });

const start = async () => {
  try {
    await server.listen({ port: PORT as number, host: '0.0.0.0' });
    server.log.info('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();