import { EntityClass } from './entity.interface';

/**
 * Interface représentant un référentiel (repository) pour des entités.
 * @interface
 * @template T - Le type d'entité représenté par le référentiel.
 */
export interface IRepository<T> {
  /**
   * Enregistre l'entité dans le référentiel.
   * @param {T} entity - L'entité à enregistrer.
   * @throws {Error} Une erreur est levée si l'entité ne peut pas être enregistrée.
   * @returns {Promise<void>}
   */
  save(entity: T): Promise<void> | void;

  /**
   * Récupère l'entité avec l'ID donné depuis le référentiel.
   * @param {string} id - L'ID de l'entité à récupérer.
   * @throws {Error} Une erreur est levée si l'entité ne peut pas être récupérée.
   * @throws {EntityNotFoundError} Une erreur est levée si aucune entité n'a été trouvée avec l'ID donné.
   * @returns {Promise<T>} L'entité récupérée.
   */
  find(id: string): Promise<Partial<T>>;

  /**
   * Récupère toutes les entités stockées dans le référentiel.
   * @throws {Error} Une erreur est levée si les entités ne peuvent pas être récupérées.
   * @returns {Promise<T[]>} Un tableau contenant toutes les entités stockées dans le référentiel.
   */
  findAll(): Promise<Partial<T>[]>;

  /**
   * Supprime l'entité avec l'ID donné depuis le référentiel.
   * @param {string} id - L'ID de l'entité à supprimer.
   * @throws {Error} Une erreur est levée si l'entité ne peut pas être supprimée.
   * @throws {EntityNotFoundError} Une erreur est levée si aucune entité n'a été trouvée avec l'ID donné.
   * @returns {Promise<void>}
   */
  delete(id: string): Promise<void>;
}

class EntityNotFoundError extends Error {
  entityClass: EntityClass;
  entityId: string;
  constructor(entityClass: EntityClass, entityId: string) {
    super(`Entity ${entityClass.name} with identifier ${entityId} not found.`);
    this.entityClass = entityClass;
    this.entityId = entityId;
  }
}

class EntityAlreadyExistsError extends Error {
  entityClass: EntityClass;
  entityId: string;
  constructor(entityClass: EntityClass, entityId: string) {
    super(
      `Entity ${entityClass.name} with identifier ${entityId} already exists.`,
    );
    this.entityClass = entityClass;
    this.entityId = entityId;
  }
}

class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const RepositoryErrors = {
  EntityNotFoundError,
  EntityAlreadyExistsError,
  RepositoryError,
};
