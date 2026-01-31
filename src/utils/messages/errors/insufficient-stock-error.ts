// errors/insufficient-stock-error.ts
export class InsufficientStockError extends Error {
  constructor(available: number) {
    super(`Estoque insuficiente. Disponível: ${available}`);
  }
}
