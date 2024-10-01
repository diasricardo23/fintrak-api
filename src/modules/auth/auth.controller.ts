import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcrypt'
import prisma from "@/utils/prisma";

export const registerHandler = async (request: FastifyRequest<{ Body: { email: string; password: string; }; }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  const dbUser = await prisma.user.findUnique({ where: { email } });

  if (dbUser) {
    return reply.status(401).send({ error: 'ERROR_AUTH_EMAIL_ALREADY_EXISTS' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return reply.status(201).send({ message: 'User created successfully' })
};
