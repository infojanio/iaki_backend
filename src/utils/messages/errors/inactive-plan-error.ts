export class InactivePlanError extends Error {
  constructor() {
    super("O plano selecionado está inativo.");
  }
}
