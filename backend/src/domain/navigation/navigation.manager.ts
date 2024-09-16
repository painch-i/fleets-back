import { Inject, Injectable } from '@nestjs/common';
import { NavigationCsvRepository } from '../../infrastructure/repositories/navigation-csv.repository';
import { NavigationRepository } from '../../infrastructure/repositories/navigation.repository';
import { RoutesService } from '../../infrastructure/routes/routes.service';
import { ValidationError } from '../_shared/errors/validation.error';
import { Line, LineId } from './line.entity';
import { INavigationCsvRepository } from './navigation-csv-provider.interface';
import { INavigationRepository } from './navigation-repository.interface';
import { GetSuggestionsBetweenStationsOptions } from './navigation.types';
import { IRoutesService, RouteSuggestion } from './routes-service.interface';
import { Station } from './station.entity';
import { getSuggestionsBetweenStationsOptionsSchema } from './validation/get-directions-between-stations-options.schema';

@Injectable()
export class NavigationManager {
  constructor(
    @Inject(NavigationRepository)
    private readonly navigationRepository: INavigationRepository,
    @Inject(NavigationCsvRepository)
    private readonly navigationCsvRepository: INavigationCsvRepository,
    @Inject(RoutesService)
    private readonly routesService: IRoutesService,
  ) {}
  getLines(): Promise<Line[]> {
    return this.navigationRepository.getLines();
  }

  getStationsInLine(lineId: LineId): Promise<Station[]> {
    return this.navigationRepository.getStations(lineId);
  }

  async refreshNavigationData(): Promise<void> {
    try {
      await this.refreshLinesData();
      console.log('Lines data refreshed');
    } catch (error) {
      console.error('Error while refreshing lines data');
      console.error(error);
    }
    let existingLines: Line[] = [];
    try {
      existingLines = await this.navigationRepository.getLines();
      console.log('Existing lines retrieved');
    } catch (error) {
      console.error('Error while getting existing lines');
      console.error(error);
    }
    try {
      await this.refreshStationsData(existingLines);
      console.log('Stations data refreshed');
    } catch (error) {
      console.error('Error while refreshing stations data');
      console.error(error);
    }
  }

  async getSuggestionsBetweenStations(
    options: GetSuggestionsBetweenStationsOptions,
  ) {
    getSuggestionsBetweenStationsOptionsSchema.parse(options);
    const foundStations = await this.navigationRepository.findStationsByIds([
      options.startStationId,
      options.endStationId,
    ]);
    let startStation: Station | undefined;
    let endStation: Station | undefined;
    for (const station of foundStations) {
      if (station.id === options.startStationId) {
        startStation = station;
      } else if (station.id === options.endStationId) {
        endStation = station;
      }
    }
    if (!startStation) {
      throw new ValidationError('Start station not found', [
        {
          code: 'station-not-found',
          path: ['startStationId'],
        },
      ]);
    }
    if (!endStation) {
      throw new ValidationError('End station not found', [
        {
          code: 'station-not-found',
          path: ['endStationId'],
        },
      ]);
    }
    const suggestions =
      await this.routesService.getRouteSuggestionsBetweenLocations({
        startLocation: {
          latitude: startStation.latitude,
          longitude: startStation.longitude,
        },
        endLocation: {
          latitude: endStation.latitude,
          longitude: endStation.longitude,
        },
      });
    const hashHistory = new Set();

    return suggestions.reduce<RouteSuggestion[]>((acc, item) => {
      if (item.linesTaken.length > 0 && !hashHistory.has(item.hash)) {
        hashHistory.add(item.hash);
        acc.push(item);
      }

      return acc;
    }, []);
  }

  private async refreshLinesData(): Promise<void> {
    let linesBuffer: Line[] = [];
    const upsertLinePromises: Promise<any>[] = [];
    for await (const line of this.navigationCsvRepository.iterateLines()) {
      linesBuffer.push(line);
      if (linesBuffer.length > 500) {
        upsertLinePromises.push(
          this.navigationRepository.upsertManyLines(linesBuffer),
        );
        linesBuffer = [];
      }
    }
    if (linesBuffer.length > 0) {
      upsertLinePromises.push(
        this.navigationRepository.upsertManyLines(linesBuffer),
      );
    }
    const results = await Promise.allSettled(upsertLinePromises);
    const rejected = results.filter((result) => result.status === 'rejected');
    if (rejected.length > 0) {
      console.error('Error while inserting lines');
      console.error(rejected);
    }
  }
  private async refreshStationsData(existingLines: Line[]): Promise<void> {
    const stationsBuffer: Station[] = [];
    const upsertStationPromises: Promise<any>[] = [];
    for await (const station of this.navigationCsvRepository.iterateStations(
      existingLines,
    )) {
      stationsBuffer.push(station);
    }
    if (stationsBuffer.length > 0) {
      upsertStationPromises.push(
        this.navigationRepository.upsertManyStations(stationsBuffer),
      );
    }
    const results = await Promise.allSettled(upsertStationPromises);
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Error while inserting stations');
        console.error(result.reason);
      }
    }
  }
}
