import { RoutesClient } from '@googlemaps/routing';
import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { createHmac } from 'node:crypto';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import { LineTaken } from '../../domain/fleets/fleets.types';
import {
  GetRouteSuggestionsBetweenLocationsOptions,
  IRoutesService,
  RouteSuggestion,
} from '../../domain/navigation/routes-service.interface';

const auth = new GoogleAuth({
  keyFile: 'fleets-7f5ae-0cebc001c976.json',
});

@Injectable()
@RequiredEnv({
  key: 'NAVIGATION_SECRET_KEY',
  schema: z.string(),
})
export class RoutesService implements IRoutesService {
  private routesClient = new RoutesClient({
    auth,
  });
  private secretKey: string;
  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get('NAVIGATION_SECRET_KEY');
  }
  compare: any;
  async getRouteSuggestionsBetweenLocations(
    options: GetRouteSuggestionsBetweenLocationsOptions,
  ): Promise<RouteSuggestion[]> {
    const routeSuggestions: RouteSuggestion[] = [];
    const [routesResponse] = await this.routesClient.computeRoutes(
      {
        languageCode: 'fr',
        origin: {
          location: {
            latLng: {
              // longitude: 1.783926, // Issou - Porcheville :)
              // latitude: 48.97906,
              latitude: options.startLocation.latitude,
              longitude: options.startLocation.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              // longitude: 2.391029, // Ivry-sur-Seine RER
              // latitude: 48.81439,
              latitude: options.endLocation.latitude,
              longitude: options.endLocation.longitude,
            },
          },
        },
        computeAlternativeRoutes: true,
        travelMode: 'TRANSIT',
      },
      {
        otherArgs: {
          headers: {
            'X-Goog-FieldMask': 'routes.legs.steps.transitDetails',
          },
        },
      },
    );
    if (!routesResponse.routes) {
      return routeSuggestions;
    }
    for (const route of routesResponse.routes) {
      const linesTakenForRoute: LineTaken[] = [];
      if (!route.legs) {
        continue;
      }
      for (const leg of route.legs) {
        if (!leg.steps) {
          continue;
        }
        for (const step of leg.steps) {
          if (!step.transitDetails || !step.transitDetails.transitLine) {
            continue;
          }
          let vehicle: LineTaken['vehicle'] | undefined;
          if (step.transitDetails.transitLine.vehicle) {
            let name = {
              text: {
                text: '',
              },
            };
            if (step.transitDetails.transitLine.vehicle.name) {
              name = {
                text: {
                  text: step.transitDetails.transitLine.vehicle.name as string,
                },
              };
            }
            vehicle = {
              name,
              type: step.transitDetails.transitLine.vehicle.type as string,
              iconUri: step.transitDetails.transitLine.vehicle
                .iconUri as string,
            };
          }
          linesTakenForRoute.push({
            name: step.transitDetails.transitLine.name as string,
            color: step.transitDetails.transitLine.color as string,
            nameShort: step.transitDetails.transitLine.nameShort as string,
            textColor: step.transitDetails.transitLine.textColor as string,
            vehicle,
          });
        }
      }
      const hash = this.computeHash(linesTakenForRoute);
      routeSuggestions.push({
        hash,
        linesTaken: linesTakenForRoute,
      });
    }
    return routeSuggestions;
  }

  validateHash(hash: string, linesTaken: LineTaken[]): boolean {
    return hash === this.computeHash(linesTaken);
  }

  private computeHash(linesTaken: LineTaken[]): string {
    return createHmac('sha512', this.secretKey)
      .update(JSON.stringify(linesTaken))
      .digest('hex');
  }
}
