import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timeStamp: Date.now(),
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    fastify.log.info(`Order service is running on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
