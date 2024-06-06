import { LineTaken } from '../fleets/fleets.types';

export type GetRouteSuggestionsBetweenLocationsOptions = {
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
};

export type RouteSuggestion = {
  hash: string;
  linesTaken: LineTaken[];
};

export interface IRoutesService {
  getRouteSuggestionsBetweenLocations(
    options: GetRouteSuggestionsBetweenLocationsOptions,
  ): Promise<RouteSuggestion[]>;
  validateHash(hash: string, linesTaken: LineTaken[]): boolean;
}
