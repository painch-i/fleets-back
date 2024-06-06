import IEntity from 'src/domain/_shared/entity.interface';
import { Id } from '../../../types';
import { User } from '../../users/entities/user.entity';
import {
  CreateJoinRequestOptions,
  JoinRequestStatus,
  JoinRequestStatusFromDatabase,
} from '../fleets.types';
import { Fleet } from './fleet.entity';
import { JoinRequestWithOptionalRelations } from './join-request.types';

export class JoinRequest extends IEntity {
  fleetId: Id;
  fleet?: Fleet;
  userId: Id;
  user?: User;
  status: JoinRequestStatus;

  create(options: CreateJoinRequestOptions) {
    this.fleetId = options.fleetId;
    this.userId = options.userId;
    this.status = JoinRequestStatus.PENDING;
  }

  accept() {
    this.status = JoinRequestStatus.ACCEPTED;
  }

  reject() {
    this.status = JoinRequestStatus.REJECTED;
  }

  static fromDatabase(joinRequestFromDb: JoinRequestWithOptionalRelations) {
    const id = joinRequestFromDb.id;
    const joinRequest = new JoinRequest(id);
    joinRequest.fleetId = joinRequestFromDb.fleetId;
    joinRequest.userId = joinRequestFromDb.userId;
    if (joinRequestFromDb.fleet) {
      joinRequest.fleet = Fleet.fromDatabase(joinRequestFromDb.fleet);
    }
    if (joinRequestFromDb.user) {
      joinRequest.user = User.fromDatabase(joinRequestFromDb.user);
    }
    joinRequest.status =
      JoinRequestStatusFromDatabase[joinRequestFromDb.status];
    return joinRequest;
  }
}
