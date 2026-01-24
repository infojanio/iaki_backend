export class StoreCategoryAlreadyLinkedError extends Error {
  constructor() {
    super("Categoria já vinculada a esta loja");
  }
}
