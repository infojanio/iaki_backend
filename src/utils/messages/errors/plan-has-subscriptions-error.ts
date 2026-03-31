export class PlanHasSubscriptionsError extends Error {
  constructor() {
    super(
      "Este plano não pode ser excluído porque possui assinanturas vinculadas.",
    );
  }
}
