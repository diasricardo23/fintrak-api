import { fastify, FastifyRequest, FastifyReply } from 'fastify';

const Port = process.env.PORT || 7000;
const server = fastify({ logger: { level: 'info' } });

server.get("/healthcheck", async (request: FastifyRequest, reply: FastifyReply) => {
  return { status: "OK" };
});

const start = async () => {
    try {
        await server.listen({ port: Port as number });
        console.log('Server started successfully');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();