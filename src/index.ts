import { fastify } from 'fastify';

const PORT = process.env.PORT || 8080;
const server = fastify({ logger: { level: 'info' } });

server.get("/healthcheck", async () => {
  return { status: "OK" };
});

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