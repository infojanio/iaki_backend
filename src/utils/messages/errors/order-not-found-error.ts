export class OrderNotFoundError extends Error {
  constructor() {
    super("Pedido não encontrado.");
  }
}
