import IEntity from 'src/domain/_shared/entity.interface';
import { z } from 'zod';
import { Id } from '../../../types';
import { Station } from '../../navigation/station.entity';
import { Member, User } from '../../users/entities/user.entity';
import {
  UserNetwork,
  UserNetworkEnumFromDatabase,
} from '../../users/entities/user.types';
import {
  CreateFleetOptions,
  FleetStatus,
  FleetStatusFromDatabase,
  FleetWithOptionalRelations,
  GenderConstraintEnum,
  LineTaken,
} from '../fleets.types';
import { lineTakenSchema } from '../validation-schemas/line-taken.schema';
import { variableStringSchema } from '../validation-schemas/variable-string.schema';

export class Fleet extends IEntity {
  name: z.infer<typeof variableStringSchema>;
  administratorId: string;
  administrator?: User;
  members?: Member[];
  startStationId: string;
  startStation?: Station;
  endStationId: string;
  endStation?: Station;
  gatheringTime: Date;
  departureTime: Date;
  genderConstraint: GenderConstraintEnum;
  isJoinable: boolean;
  status: FleetStatus;
  linesTaken: LineTaken[];
  network: UserNetwork | null;

  create(options: CreateFleetOptions): void {
    const {
      name,
      administratorId,
      startStationId,
      endStationId,
      departureTime,
      gatheringDelay,
    } = options;
    this.name = name;
    this.administratorId = administratorId;
    this.startStationId = startStationId;
    this.endStationId = endStationId;
    this.departureTime = departureTime;
    this.gatheringTime = new Date(departureTime);
    this.gatheringTime.setMinutes(
      this.gatheringTime.getMinutes() - gatheringDelay,
    );
    this.isJoinable = true;
    this.status = FleetStatus.FORMATION;
    this.linesTaken = options.route.linesTaken;
  }

  setGenderConstraint(genderConstraint: GenderConstraintEnum): void {
    this.genderConstraint = genderConstraint;
  }

  static fromDatabase(fleetFromDb: FleetWithOptionalRelations) {
    const fleet = new Fleet(fleetFromDb.id);
    fleet.name = fleetFromDb.name;
    fleet.administratorId = fleetFromDb.administratorId;
    if (fleetFromDb.administrator) {
      fleet.administrator = User.fromDatabase(fleetFromDb.administrator);
    }
    fleet.startStationId = fleetFromDb.startStationId;
    if (fleetFromDb.startStation) {
      fleet.startStation = Station.fromDatabase(fleetFromDb.startStation);
    }
    fleet.endStationId = fleetFromDb.endStationId;
    if (fleetFromDb.endStation) {
      fleet.endStation = Station.fromDatabase(fleetFromDb.endStation);
    }

    fleet.gatheringTime = new Date(fleetFromDb.gatheringTime);
    fleet.departureTime = new Date(fleetFromDb.departureTime);
    fleet.genderConstraint = GenderConstraintEnum[fleetFromDb.genderConstraint];
    fleet.isJoinable = fleetFromDb.isJoinable;
    if (fleetFromDb.memberships && fleetFromDb.memberships.length > 0) {
      const memberships = fleetFromDb.memberships;
      fleet.members = memberships.map((membership) =>
        Member.fromMembership(membership),
      );
    }
    fleet.status = FleetStatusFromDatabase[fleetFromDb.status];
    fleet.linesTaken = z.array(lineTakenSchema).parse(fleetFromDb.linesTaken);
    fleet.network = fleetFromDb.network
      ? UserNetworkEnumFromDatabase[fleetFromDb.network]
      : null;
    return fleet;
  }

  hasGatheringStarted() {
    return this.status === FleetStatus.GATHERING;
  }

  startGathering() {
    this.status = FleetStatus.GATHERING;
  }

  hasTripStarted() {
    return this.status === FleetStatus.TRAVELING;
  }

  startTrip() {
    this.status = FleetStatus.TRAVELING;
  }

  end() {
    this.status = FleetStatus.ARRIVED;
  }
}

export type FleetId = Id;
