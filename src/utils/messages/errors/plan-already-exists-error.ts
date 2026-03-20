export class PlanAlreadyExistsError extends Error {
  constructor() {
    super("Já existe um plano com esse nome.");
  }
}
