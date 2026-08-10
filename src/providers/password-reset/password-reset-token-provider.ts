import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

interface ResetPayload {
  userId: string;
  email: string;

  codeHash: string;
  passwordFingerprint: string;

  nonce: string;

  exp: number;
}

export class PasswordResetTokenProvider {
  private get secret() {
    const secret = process.env.PASSWORD_RESET_SECRET;

    if (!secret) {
      throw new Error("PASSWORD_RESET_SECRET não configurado.");
    }

    return secret;
  }

  private sign(value: string) {
    return createHmac("sha256", this.secret).update(value).digest("hex");
  }

  private safeCompare(a: string, b: string) {
    const bufferA = Buffer.from(a);

    const bufferB = Buffer.from(b);

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  }

  generateCodeHash(code: string, nonce: string) {
    return this.sign(`${nonce}:${code}`);
  }

  generatePasswordFingerprint(passwordHash: string) {
    return this.sign(`password:${passwordHash}`);
  }

  generate({
    userId,
    email,
    code,
    passwordHash,
  }: {
    userId: string;
    email: string;
    code: string;
    passwordHash: string;
  }) {
    const nonce = randomBytes(16).toString("hex");

    const payload: ResetPayload = {
      userId,

      email,

      nonce,

      codeHash: this.generateCodeHash(code, nonce),

      passwordFingerprint: this.generatePasswordFingerprint(passwordHash),

      exp: Date.now() + 10 * 60 * 1000,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );

    const signature = this.sign(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  verify(token: string): ResetPayload {
    const [encodedPayload, receivedSignature] = token.split(".");

    if (!encodedPayload || !receivedSignature) {
      throw new Error("Código inválido ou expirado.");
    }

    const expectedSignature = this.sign(encodedPayload);

    if (!this.safeCompare(expectedSignature, receivedSignature)) {
      throw new Error("Código inválido ou expirado.");
    }

    let payload: ResetPayload;

    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8"),
      );
    } catch {
      throw new Error("Código inválido ou expirado.");
    }

    if (Date.now() > payload.exp) {
      throw new Error("Código inválido ou expirado.");
    }

    return payload;
  }

  validateCode({ payload, code }: { payload: ResetPayload; code: string }) {
    const receivedHash = this.generateCodeHash(code, payload.nonce);

    return this.safeCompare(payload.codeHash, receivedHash);
  }
}
