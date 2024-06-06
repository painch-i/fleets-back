import { Email } from './email.value-object';

describe('Email Value Object', () => {
  describe('create', () => {
    it('doit créer un email valide', () => {
      const emailValue = 'john.doe@example.com';
      const email = new Email(emailValue);

      expect(email.getValue()).toBe(emailValue);
    });

    it('doit lever une erreur pour un email invalide', () => {
      const invalidEmail = 'john.doe@ex';

      expect(() => new Email(invalidEmail)).toThrow();
    });
  });
});
