export class CityNotFoundError extends Error {
  constructor() {
    super("Cidade não encontrado.");
  }
}
