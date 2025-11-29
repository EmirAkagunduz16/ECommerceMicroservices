import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";

export const orderRouter = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      try {
        const order = await Order.find({ userId: request.userId });
        return reply.status(200).send(order);
      } catch (error) {}
    }
  );

  fastify.get(
    "/orders",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      try {
        const order = await Order.find();
        return reply.status(200).send(order);
      } catch (error) {}
    }
  );
};
