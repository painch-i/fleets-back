import {
  Fleet,
  FleetExtendedStatus,
  FleetIntermediateStatus,
  FleetStatus,
} from '@/features/fleets/types/fleet.types';
import { formatTime } from '@/utils/date';

export const getFleetIntermediateStatus = (
  status: FleetStatus,
  countdown: string,
): FleetExtendedStatus => {
  if (countdown === '00:00') {
    if (status === FleetStatus.FORMATION) {
      return FleetIntermediateStatus.WAITING_ON_GATHERING;
    }

    if (status === FleetStatus.GATHERING) {
      return FleetIntermediateStatus.WAITING_ON_TRAVELING;
    }
  }

  return status;
};

export function getCountDown(fleet: Fleet): string {
  const { gatheringTime, departureTime } = fleet;

  const currentDate = new Date();
  const gatheringDate = new Date(gatheringTime);
  const departureDate = new Date(departureTime);

  const finalDate =
    fleet.status === FleetStatus.FORMATION ? gatheringDate : departureDate;

  let durationInSeconds = 0;

  if (finalDate > currentDate) {
    durationInSeconds = Math.round(Math.abs(+finalDate - +new Date()) / 1000);
  }

  return formatTime(durationInSeconds);
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function checkRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): boolean {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance <= 0.2;
}
