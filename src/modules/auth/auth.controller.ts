import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcrypt'
import prisma from "@/utils/prisma";

export const login = async (request: FastifyRequest<{ Body: { email: string; password: string; }; }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  const dbUser = await prisma.user.findUnique({ where: { email } });

  if (!dbUser) {
    return reply.status(401).send({ error: 'ERROR_AUTH_INVALID_CREDENTIALS' })
  }

  const isPasswordValid = await bcrypt.compare(password, dbUser.password)

  if (!isPasswordValid) {
    return reply.status(401).send({ error: 'ERROR_AUTH_INVALID_CREDENTIALS' })
  }

  const payload = { id: dbUser.id, email: dbUser.email }

  const token = request.jwt.sign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
  })

  return { accessToken: token }
}

export const register = async (request: FastifyRequest<{ Body: { email: string; password: string; }; }>, reply: FastifyReply) => {
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

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('access_token')
  return { message: 'User logged out successfully' }
}