import {
  Member,
  User,
  UserGenderPathAsset,
  UserId,
  UserNetwork,
} from '@/features/auth/types/user.types';
import { Line, LineID } from '@/features/search/types/line.types';
import { Station, StationID } from '@/features/search/types/station.types';
import {
  LineTaken,
  RouteSuggestion,
} from '@/features/search/types/suggestion.types';
import { ID } from '@/types';

export type FleetID = ID;

export enum FleetStatus {
  FORMATION = 'formation',
  GATHERING = 'gathering',
  TRAVELING = 'traveling',
  ARRIVED = 'arrived',
}

export enum FleetIntermediateStatus {
  WAITING_ON_GATHERING = 'waiting_on_gathering',
  WAITING_ON_TRAVELING = 'waiting_on_traveling',
}

export type FleetExtendedStatus = FleetStatus | FleetIntermediateStatus;

export interface Fleet {
  id: FleetID;
  name: string;
  administratorId: UserId;
  administrator?: User;
  members: Member[];
  lineId: LineID;
  line: Line;
  startStationId: StationID;
  startStation: Station;
  endStationId: StationID;
  endStation: Station;
  gatheringTime: string;
  departureTime: string;
  genderConstraint: GenderConstraint;
  isJoinable: boolean;
  status: FleetStatus;
  linesTaken: LineTaken[];
  network: UserNetwork | null;
}

export enum GenderConstraintCreationConfig {
  USER_GENDER_ONLY = 'USER_GENDER_ONLY',
  ANY_GENDER = 'ANY_GENDER',
}

export interface CreateFleetDto {
  name: string;
  endStationId: StationID;
  startStationId: StationID;
  departureTime: Date;
  gatheringDelay: number;
  genderConstraintConfig: GenderConstraintCreationConfig;
  route: RouteSuggestion;
}

export interface IFleetContext {
  fleet: Fleet;
  extendedStatus: FleetExtendedStatus;
  countDown: string;
  isCurrentUserAdmin: boolean;
  hasCurrentUserConfirmedPresenceAtStartStation: boolean;
  isFetching: boolean;
  invalidateCurrentFleetQuery: () => void;
}

export enum GenderConstraint {
  MALE_ONLY = 'MALE_ONLY',
  FEMALE_ONLY = 'FEMALE_ONLY',
  NO_CONSTRAINT = 'NO_CONSTRAINT',
}

export const GenderConstraintPathAsset: Record<GenderConstraint, string> = {
  [GenderConstraint.MALE_ONLY]: UserGenderPathAsset.MALE,
  [GenderConstraint.FEMALE_ONLY]: UserGenderPathAsset.FEMALE,
  [GenderConstraint.NO_CONSTRAINT]: './assets/icons/unisex.png',
};

export enum MemberOptions {
  EXCLUDE = 'Exclure',
  ACCEPT = 'Accepter',
  REJECT = 'Rejeter',
}

type MemberLabelByName = (name: string) => string;

export const MemberOptionsLabel: Record<MemberOptions, MemberLabelByName> = {
  [MemberOptions.EXCLUDE]: (name: string) =>
    `Êtes vous sûr de vouloir exclure ${name} de ce fleet ?`,
  [MemberOptions.ACCEPT]: (name: string) =>
    `Accepter ${name} dans votre fleet ?`,
  [MemberOptions.REJECT]: (name: string) => `Rejeter la demande de ${name} ?`,
};

type StringTransformer = (text?: string) => string;

export const FleetStatusLabel: Record<
  Partial<FleetExtendedStatus>,
  StringTransformer
> = {
  [FleetStatus.FORMATION]: (text?: string) => `Rassemblement dans ${text}`,
  [FleetIntermediateStatus.WAITING_ON_GATHERING]: () =>
    'En attente du rassemblement...',
  [FleetStatus.GATHERING]: (text?: string) => `Départ dans ${text}`,
  [FleetIntermediateStatus.WAITING_ON_TRAVELING]: () =>
    'En attente du départ...',
  [FleetStatus.TRAVELING]: (text?: string) => `Trajet en cours vers ${text}`,
  [FleetStatus.ARRIVED]: () => '',
};
