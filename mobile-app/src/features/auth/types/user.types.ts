import { IconType } from 'react-icons';
import { FaMars, FaVenus } from 'react-icons/fa';

import { Fleet, FleetID } from '@/features/fleets/types/fleet.types';
import { ID } from '@/types/utils';

export type UserId = ID;

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface User {
  id: UserId;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  gender: Gender;
  fleetId: FleetID | null;
  fleet?: Fleet;
  isOnboarded: true;
}

export interface PendingUser {
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  gender: Gender | null;
  isOnboarded: false;
}

export type UserOrPendingUser = User | PendingUser;

export interface Member extends User {
  hasConfirmedHisPresence: boolean;
  fleetId: FleetID;
}

export interface StartLoginDto {
  email: string;
}

export interface StartRegistrationDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface CompleteRegistrationDto {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
}

export interface AccessTokenRes {
  token: string;
  type: string;
}

export enum UserNetwork {
  ETNA = 'ETNA',
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

export interface IAccountCreationContext {
  currentStep: 0 | 1;
  accountData: CompleteRegistrationDto;
  setCurrentStep: React.Dispatch<React.SetStateAction<0 | 1>>;
  setAccountData: (value: Partial<CompleteRegistrationDto>) => void;
  isFieldDisabled: Record<keyof CompleteRegistrationDto, boolean>;
}
