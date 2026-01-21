// src/errors/user-not-found-error.ts
export class CartFromAnotherStoreError extends Error {
  constructor() {
    super(
      "Você já possui um carrinho ativo em outra loja. Finalize ou limpe o carrinho para continuar.",
    );
    this.name = "CartFromAnotherStoreError";
  }
}
