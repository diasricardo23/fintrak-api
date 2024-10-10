import { FastifyInstance } from "fastify";
import { login, logout, register } from "./auth.controller";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.delete("/logout", { preHandler: [fastify.authenticate] }, logout);

  fastify.log.info("Auth routes registered");
};

export default authRoutes;