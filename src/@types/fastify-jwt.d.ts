import "@fastify/jwt";
declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string; // userId
      role: "ADMIN" | "USER" | "STORE_ADMIN";
      storeId?: string;
    };
  }
}
