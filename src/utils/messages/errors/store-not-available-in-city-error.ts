export class StoreNotAvailableInCityError extends Error {
  constructor() {
    super("Esta loja não atende a cidade selecionada.");
  }
}
