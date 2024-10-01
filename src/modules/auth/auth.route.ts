import { FastifyInstance } from "fastify";
import { registerHandler } from "./auth.controller";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/register", registerHandler);
};

export default authRoutes;