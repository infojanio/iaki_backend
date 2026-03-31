import "@fastify/jwt";
declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string; // userId
      role: "SUPER_ADMIN" | "ADMIN" | "USER";
      storeId?: string;
    };
  }
}
