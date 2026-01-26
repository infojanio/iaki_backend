export class CartNotFoundError extends Error {
  constructor() {
    super("Carrinho vazio ou não encontrado");
  }
}
