import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export interface PasswordResetPayload {
  userId: string;
  email: string;

  codeHash: string;
  passwordFingerprint: string;

  nonce: string;

  expiresAt: number;
}

interface GeneratePasswordResetTokenParams {
  userId: string;
  email: string;
  code: string;
  passwordHash: string;
}

export class PasswordResetTokenProvider {
  private readonly secret: string;

  constructor() {
    const secret = process.env.PASSWORD_RESET_SECRET;

    if (!secret) {
      throw new Error("PASSWORD_RESET_SECRET não configurado.");
    }

    this.secret = secret;
  }

  private createSignature(value: string) {
    return createHmac("sha256", this.secret).update(value).digest("hex");
  }

  private safeCompareHex(first: string, second: string) {
    try {
      const firstBuffer = Buffer.from(first, "hex");

      const secondBuffer = Buffer.from(second, "hex");

      if (
        firstBuffer.length === 0 ||
        firstBuffer.length !== secondBuffer.length
      ) {
        return false;
      }

      return timingSafeEqual(firstBuffer, secondBuffer);
    } catch {
      return false;
    }
  }

  generateCodeHash(code: string, nonce: string) {
    return this.createSignature(`code:${nonce}:${code}`);
  }

  generatePasswordFingerprint(passwordHash: string) {
    return this.createSignature(`password:${passwordHash}`);
  }

  generate({
    userId,
    email,
    code,
    passwordHash,
  }: GeneratePasswordResetTokenParams) {
    const nonce = randomBytes(32).toString("hex");

    const payload: PasswordResetPayload = {
      userId,

      email: email.trim().toLowerCase(),

      nonce,

      codeHash: this.generateCodeHash(code, nonce),

      passwordFingerprint: this.generatePasswordFingerprint(passwordHash),

      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    const encodedPayload = Buffer.from(
      JSON.stringify(payload),
      "utf8",
    ).toString("base64url");

    const signature = this.createSignature(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  verify(token: string): PasswordResetPayload {
    const parts = token.split(".");

    if (parts.length !== 2) {
      throw new Error("Token inválido.");
    }

    const [encodedPayload, receivedSignature] = parts;

    const expectedSignature = this.createSignature(encodedPayload);

    if (!this.safeCompareHex(receivedSignature, expectedSignature)) {
      throw new Error("Token inválido.");
    }

    let payload: PasswordResetPayload;

    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8"),
      );
    } catch {
      throw new Error("Token inválido.");
    }

    if (
      !payload.userId ||
      !payload.email ||
      !payload.codeHash ||
      !payload.passwordFingerprint ||
      !payload.nonce ||
      !payload.expiresAt
    ) {
      throw new Error("Token inválido.");
    }

    if (Date.now() > payload.expiresAt) {
      throw new Error("Token expirado.");
    }

    return payload;
  }

  validateCode(payload: PasswordResetPayload, code: string) {
    const receivedHash = this.generateCodeHash(code, payload.nonce);

    return this.safeCompareHex(payload.codeHash, receivedHash);
  }

  validatePasswordFingerprint(
    payload: PasswordResetPayload,
    passwordHash: string,
  ) {
    const currentFingerprint = this.generatePasswordFingerprint(passwordHash);

    return this.safeCompareHex(payload.passwordFingerprint, currentFingerprint);
  }
}
