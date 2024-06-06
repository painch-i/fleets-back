import { z } from 'zod';
import { roundToMinutes } from '../../../utils';

export function getDepartureTimeSchema(minDepartureDelay: number) {
  return z
    .date()
    .refine(
      minimumMinutesDelay(minDepartureDelay),
      `Departure time must be at least ${minDepartureDelay} minutes from now`,
    )
    .transform(roundToMinutes);
}

export function getSearchDepartureTimeSchema(minFormationDelay: number) {
  return z
    .date()
    .refine(
      minimumMinutesDelay(minFormationDelay),
      `Departure time must be at least ${minFormationDelay} minutes from now`,
    )
    .transform(roundToMinutes);
}

function minimumMinutesDelay(delay: number) {
  return (value: Date) => {
    const parsedDate = new Date(value);
    if (parsedDate.toString() === 'Invalid Date') {
      return false;
    }
    const minDate = new Date();
    roundToMinutes(minDate);
    minDate.setMinutes(minDate.getMinutes() + delay);
    if (parsedDate < minDate) {
      return false;
    }
    return true;
  };
}
