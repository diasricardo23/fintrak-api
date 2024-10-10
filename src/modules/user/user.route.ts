import { FastifyInstance } from "fastify";
import { getAllUsers, getUserById } from "./user.controller";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, getAllUsers);
  fastify.get("/:id", { preHandler: [fastify.authenticate] }, getUserById);

  fastify.log.info("User routes registered");
};

export default userRoutes;