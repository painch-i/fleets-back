export type StoreEventOptions = {
  createdAt: Date;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: object;
};

/**
 * Interface représentant un stockage d'événements.
 * @interface
 */
export interface IEventStore {
  /**
   * Stocke un événement dans le système de stockage d'événements.
   * @param {StoreEventOptions} options - Les options de stockage de l'événement.
   * @throws {Error} Une erreur est levée si l'événement ne peut pas être stocké.
   * @returns {void}
   */
  store(options: StoreEventOptions): Promise<void>;
}
