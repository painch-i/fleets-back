import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClearPassword } from '../../domain/users/value-objects/clear-password.value-object';
import { EncryptedPassword } from '../../domain/users/value-objects/encrypted-password.value-object';
import { ValueObject } from '../../domain/_shared/value-object.interface';

@Injectable()
export class ValueObjectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Convertissez ici les objets de valeur en valeurs imbriquées
        if (Array.isArray(data)) {
          return data.map((item) => this.convertToPlainValues(item));
        }
        return this.convertToPlainValues(data);
      }),
    );
  }

  private convertToPlainValues(input: any): any {
    if (input instanceof ValueObject) {
      return input.getValue(); // Obtenez la valeur plain
    }
    if (input instanceof Date) {
      return input.toISOString(); // Obtenez la valeur plain
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.convertToPlainValues(item)); // Récursivement pour les tableaux
    }

    if (typeof input === 'object' && input !== null) {
      const result: any = {};
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          if (
            input[key] instanceof EncryptedPassword ||
            input[key] instanceof ClearPassword
          ) {
            continue; // Ignorez les mots de passe
          }
          result[key] = this.convertToPlainValues(input[key]); // Récursivement pour les propriétés de l'objet
        }
      }
      return result;
    }
    return input; // Retournez les valeurs non modifiées
  }
}
