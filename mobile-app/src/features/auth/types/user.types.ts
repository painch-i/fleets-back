import { IconType } from 'react-icons';
import { FaMars, FaVenus } from 'react-icons/fa';

import { Fleet, FleetID } from '@/features/fleets/types/fleet.types';
import { ID } from '@/types';

export type UserId = ID;

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface User {
  id: UserId;
  email: string;
  isPreRegistered: boolean;
  isRegistered: boolean;
  encryptedPassword: string;
  gender: Gender;
  fleetId: FleetID | null;
  fleet?: Fleet;
}

export interface Member extends User {
  hasConfirmedHisPresence: boolean;
  fleetId: FleetID;
}

export interface CreateUserDto {
  email: string;
  password: string;
  gender: Gender;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AccessTokenDto {
  access_token: string;
  token_type: string;
}

export const UserGenderPathAsset: Record<Gender, string> = {
  [Gender.MALE]: './assets/icons/man.png',
  [Gender.FEMALE]: './assets/icons/woman.png',
};

export const UserGenderIcons: Record<Gender, IconType> = {
  [Gender.MALE]: FaMars,
  [Gender.FEMALE]: FaVenus,
};

export interface IUserContext {
  user: User;
}
