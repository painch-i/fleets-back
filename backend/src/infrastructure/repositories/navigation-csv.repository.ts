import { Injectable } from '@nestjs/common';
import { Options, parse } from 'csv-parse';
import { request } from 'node:https';
import { Line } from '../../domain/navigation/line.entity';
import { INavigationCsvRepository } from '../../domain/navigation/navigation-csv-provider.interface';
import { Station } from '../../domain/navigation/station.entity';
const parseOptions: Options = {
  delimiter: ';',
  // Skip the first line of the CSV file (headers)
  from_line: 2,
};

export type CsvLineRow = string[];

const CSV_LINES_URL = `https://data.iledefrance-mobilites.fr/api/explore/v2.1/catalog/datasets/referentiel-des-lignes/exports/csv?lang=fr&refine=transportmode:"rail"&refine=transportmode:"metro"&refine=transportmode:"tram"&facet=facet(name="transportmode", disjunctive=true)&timezone=Europe/Berlin&use_labels=true&delimiter=${parseOptions.delimiter}`;
const CSV_STATIONS_URL = `https://data.iledefrance-mobilites.fr/api/explore/v2.1/catalog/datasets/arrets-lignes/exports/csv?lang=fr&facet=facet(name="id", disjunctive=true)&timezone=Europe/Berlin&use_labels=true&delimiter=${parseOptions.delimiter}`;

@Injectable()
export class NavigationCsvRepository implements INavigationCsvRepository {
  async *iterateLines(): AsyncIterableIterator<Line> {
    for await (const csvLine of this.iterateCsv(CSV_LINES_URL)) {
      yield Line.fromCsv(csvLine);
    }
  }
  async *iterateStations(lines: Line[]): AsyncIterableIterator<Station> {
    const url = `${CSV_STATIONS_URL}${toLineIdFilters(lines)}`;
    for await (const csvLine of this.iterateCsv(url)) {
      yield Station.fromCsv(csvLine);
    }
  }
  private async *iterateCsv(url: string): AsyncIterableIterator<CsvLineRow> {
    const parser = parse(parseOptions);
    const csvRequest = request(url, (response) => {
      response.pipe(parser);
    });
    csvRequest.end();
    for await (const line of parser) {
      yield line;
    }
  }
}

function toLineIdFilters(lines: Line[]): string {
  // &refine=id:"IDFM:C01398"&refine=id:"IDFM:C01040"&refine=id:"IDFM:C00669"&refine=id:"IDFM:C01401"&refine=id:"IDFM:C01049"&refine=id:"IDFM:C00454"
  return lines.map((line) => `&refine=id:"IDFM:${line.externalId}"`).join('');
}
