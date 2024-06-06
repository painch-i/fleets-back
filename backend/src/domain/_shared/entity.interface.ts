import { v4 as uuidv4 } from 'uuid';
import { Id } from '../../types';
export default abstract class IEntity {
  id: Id;
  constructor(id?: Id) {
    this.id = id ? id : uuidv4();
  }
}

export type EntityClass = {
  new (...args): IEntity;
};
