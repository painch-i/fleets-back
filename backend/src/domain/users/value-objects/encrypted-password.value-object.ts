import bcrypt from 'bcrypt';
import { ClearPassword } from './clear-password.value-object';

type CompareOptions = {
  attemptPassword: string;
  encryptedPassword: string;
};

export class EncryptedPassword {
  static fromClearPassword(clearPassword: ClearPassword): string {
    const encryptedPassword = bcrypt.hashSync(clearPassword.getValue(), 10);
    return encryptedPassword;
  }

  static compare({
    attemptPassword,
    encryptedPassword,
  }: CompareOptions): boolean {
    const isValid = bcrypt.compareSync(attemptPassword, encryptedPassword);
    return isValid;
  }
}
