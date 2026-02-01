export class AdminWithoutStoreError extends Error {
  constructor() {
    super("Administrador não vinculado a loja.");
  }
}
