import { Line } from './line.entity';
import { Station } from './station.entity';
// route_id	route_long_name	plans	schedules	stop_id	stop_name	stop_lon	stop_lat	OperatorName	Pointgeo	Nom_commune	Code_insee

export enum StationField {
  'route_id' = 0,
  'route_long_name' = 1,
  'plans' = 2,
  'schedules' = 3,
  'stop_id' = 4,
  'stop_name' = 5,
  'stop_lon' = 6,
  'stop_lat' = 7,
  'OperatorName' = 8,
  'Pointgeo' = 9,
  'Nom_commune' = 10,
  'Code_insee' = 11,
}

export enum LineField {
  'ID_Line' = 0,
  'Name_Line' = 1,
  'ShortName_Line' = 2,
  'TransportMode' = 3,
  'TransportSubMode' = 4,
  'Type' = 5,
  'OperatorRef' = 6,
  'OperatorName' = 7,
  'AdditionalOperatorsRef' = 8,
  'NetworkName' = 9,
  'ColourWeb_hexa' = 10,
  'TextColourWeb_hexa' = 11,
  'ColourPrint_CMJN' = 12,
  'TextColourPrint_hexa' = 13,
  'Accessibility' = 14,
  'Audiblesigns_Available' = 15,
  'Visualsigns_Available' = 16,
  'ID_GroupOfLines' = 17,
  'ShortName_GroupOfLines' = 18,
  'Notice_Title' = 19,
  'Notice_Text' = 20,
  'Picto' = 21,
  'Valid_fromDate' = 22,
  'Valid_toDate' = 23,
  'Status' = 24,
  'PrivateCode' = 25,
}

export interface INavigationCsvRepository {
  iterateLines(): AsyncIterableIterator<Line>;
  iterateStations(lines: Line[]): AsyncIterableIterator<Station>;
}
