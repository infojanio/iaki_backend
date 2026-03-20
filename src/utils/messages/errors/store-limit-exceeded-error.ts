export class StoreLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
  }
}
