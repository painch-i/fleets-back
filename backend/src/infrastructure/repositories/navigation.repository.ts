import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Line } from '../../domain/navigation/line.entity';
import { INavigationRepository } from '../../domain/navigation/navigation-repository.interface';
import { Station } from '../../domain/navigation/station.entity';
import { Id } from '../../types';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';

@Injectable()
export class NavigationRepository implements INavigationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLines(include?: Prisma.LineInclude): Promise<Line[]> {
    const foundLines = await this.prisma.line.findMany({
      orderBy: {
        name: 'asc',
      },
      include,
    });
    return foundLines.map((line) => Line.fromDatabase(line));
  }

  async getStations(lineId?: Id): Promise<Station[]> {
    const where: Prisma.StationWhereInput = {};
    if (lineId !== undefined) {
      where.lines = {
        some: {
          id: {
            equals: lineId,
          },
        },
      };
    }
    const foundStations = await this.prisma.station.findMany({
      where,
      // include: {
      //   lines: true,
      // },
    });

    const uniqueStationsMap = {};

    const uniqueStations = foundStations.filter((station) => {
      const name = station.name;
      if (!uniqueStationsMap[name]) {
        uniqueStationsMap[name] = true;
        return true;
      }
      return false;
    });

    const alphabeticallySortedStations = uniqueStations.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return alphabeticallySortedStations.map(Station.fromDatabase);
  }
  async upsertManyStations(stations: Station[]): Promise<void> {
    // Transaction all stations
    await this.prisma.$transaction(
      stations.map((station) => {
        const stationDatabase = station.toDatabase();
        return this.prisma.station.upsert({
          where: { externalId: stationDatabase.externalId },
          create: {
            ...stationDatabase,
          },
          update: {
            ...stationDatabase,
            id: undefined,
          },
        });
      }),
      {
        isolationLevel: 'Serializable',
      },
    );
  }
  async upsertManyLines(lines: Line[]): Promise<void> {
    // Transaction all lines
    await this.prisma.$transaction(
      lines.map((line) => {
        return this.prisma.line.upsert({
          where: { externalId: line.externalId },
          create: line.toDatabase(),
          update: {
            ...line.toDatabase(),
            id: undefined,
          },
        });
      }),
    );
  }

  async findStationsByIds(ids: Id[]): Promise<Station[]> {
    const foundStations = await this.prisma.station.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return foundStations.map(Station.fromDatabase);
  }
}
