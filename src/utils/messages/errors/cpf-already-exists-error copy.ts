export class CpdfAlreadyExistsError extends Error {
  constructor() {
    super("CPF já cadastrado.");
  }
}
