import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { getSuggestionsBetweenStationsOptionsSchema } from './validation/get-directions-between-stations-options.schema';

type LineRelationWithCount = keyof Prisma.LineInclude;
type LineRelation = Exclude<LineRelationWithCount, '_count'>;
type LineIncludeAll = {
  [P in LineRelation]: true;
};
// 2: This type will include many users and all their cars
type LineWithRelations = Prisma.LineGetPayload<{
  include: LineIncludeAll;
}>;

export type LineWithOptionalRelations = Omit<LineWithRelations, LineRelation> &
  Partial<Pick<LineWithRelations, LineRelation>>;

type StationRelationWithCount = keyof Prisma.StationInclude;
type StationRelation = Exclude<StationRelationWithCount, '_count'>;
type StationIncludeAll = {
  [P in StationRelation]: true;
};
// 2: This type will include many users and all their cars
type StationWithRelations = Prisma.StationGetPayload<{
  include: StationIncludeAll;
}>;

export type StationWithOptionalRelations = Omit<
  StationWithRelations,
  StationRelation
> &
  Partial<Pick<StationWithRelations, StationRelation>>;

export type GetSuggestionsBetweenStationsOptions = z.infer<
  typeof getSuggestionsBetweenStationsOptionsSchema
>;
