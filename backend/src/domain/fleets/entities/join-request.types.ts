import { Prisma } from '@prisma/client';

type JoinRequestRelationWithCount = keyof Prisma.JoinRequestInclude;
type JoinRequestRelation = Exclude<JoinRequestRelationWithCount, '_count'>;
type JoinRequestIncludeAll = {
  [P in JoinRequestRelation]: true;
};
// 2: This type will include many users and all their cars
type JoinRequestWithRelations = Prisma.JoinRequestGetPayload<{
  include: JoinRequestIncludeAll;
}>;

export type JoinRequestWithOptionalRelations = Omit<
  JoinRequestWithRelations,
  JoinRequestRelation
> &
  Partial<Pick<JoinRequestWithRelations, JoinRequestRelation>>;
