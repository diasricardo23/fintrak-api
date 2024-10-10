import { FastifyInstance } from "fastify";
import { getAllUsers, getLoggedUser, getUserById } from "./user.controller";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, getAllUsers);
  fastify.get("/:id", { preHandler: [fastify.authenticate] }, getUserById);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, getLoggedUser);

  fastify.log.info("User routes registered");
};

export default userRoutes;