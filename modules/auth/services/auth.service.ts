import "server-only";

import { USER_ROLE } from "@/constants";
import { prisma } from "@/lib/prisma";

import { AUTH_MESSAGES } from "../constants";
import type {
  AuthenticatedUser,
  LoginDto,
  SetupDto,
} from "../types";
import { hashPassword, verifyPassword } from "../utils";
import { loginSchema, setupSchema } from "../validators";

export class AuthServiceError extends Error {
  constructor(
    public readonly code: "SETUP_COMPLETED",
    message: string,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export class AuthService {
  async hasUsers(): Promise<boolean> {
    return (await prisma.usuario.count()) > 0;
  }

  async authenticate(input: LoginDto): Promise<AuthenticatedUser | null> {
    const data = loginSchema.parse(input);
    const usuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (
      !usuario?.estado ||
      !(await verifyPassword(data.password, usuario.passwordHash))
    ) {
      return null;
    }

    return {
      id: usuario.id,
      name: usuario.nombre,
      email: usuario.correo,
      role: usuario.role,
    };
  }

  async createInitialUser(input: SetupDto): Promise<AuthenticatedUser> {
    const data = setupSchema.parse(input);
    const passwordHash = await hashPassword(data.password);

    return prisma.$transaction(
      async (transaction) => {
        if ((await transaction.usuario.count()) > 0) {
          throw new AuthServiceError(
            "SETUP_COMPLETED",
            AUTH_MESSAGES.setupCompleted,
          );
        }

        const existingInstructor = await transaction.instructor.findUnique({
          where: { correo: data.correo },
        });
        const usuario = await transaction.usuario.create({
          data: {
            nombre: data.nombre,
            correo: data.correo,
            passwordHash,
            role: USER_ROLE.ADMIN,
          },
        });

        if (existingInstructor) {
          await transaction.instructor.update({
            where: { id: existingInstructor.id },
            data: {
              usuarioId: usuario.id,
              nombre: data.nombre,
              estado: true,
            },
          });
        } else {
          await transaction.instructor.create({
            data: {
              usuarioId: usuario.id,
              nombre: data.nombre,
              correo: data.correo,
            },
          });
        }

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.correo,
          role: usuario.role,
        };
      },
      { isolationLevel: "Serializable" },
    );
  }
}

export const authService = new AuthService();
