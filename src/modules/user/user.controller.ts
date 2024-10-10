import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/utils/prisma";

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, createdAt: true, updatedAt: true } });
  return reply.send(users)
};

export const getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const { id } = request.params;
    const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: { id: true, email: true, createdAt: true, updatedAt: true } });

    return reply.send(user);
  } catch (error: any) {
    if (error.message === 'No User found') {
      return reply.status(404).send({ error: 'ERROR_USER_NOT_FOUND' });
    }

    return reply.status(500).send({ error: 'ERROR_GET_USER_BY_ID' });
  }
};