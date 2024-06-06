import { DomainError } from '../../_shared/errors/domain.error';

export class FleetNotGatheringError extends DomainError {
  constructor() {
    super('Fleet is not in gathering status', 'VALIDATION_ERROR');
  }
}

export class UserNotMeetingConstraintsError extends DomainError {
  constructor() {
    super('User not meeting constraints', 'CONSTRAINT_VIOLATION');
  }
}

export class FleetIsFullError extends DomainError {
  constructor() {
    super('Fleet is full', 'CONSTRAINT_VIOLATION');
  }
}

export class UserAlreadyHasAFleetError extends DomainError {
  constructor() {
    super('User already has a fleet', 'CONSTRAINT_VIOLATION');
  }
}

export class UserAlreadyRequestedToJoinFleetError extends DomainError {
  constructor() {
    super('User already requested to join fleet', 'CONSTRAINT_VIOLATION');
  }
}

export class JoinRequestAlreadyHandledError extends DomainError {
  constructor() {
    super('Join request already handled', 'CONSTRAINT_VIOLATION');
  }
}

export class FleetGatheringAlreadyStartedError extends DomainError {
  constructor() {
    super('Fleet gathering has already started', 'CONSTRAINT_VIOLATION');
  }
}

export class FleetTripAlreadyStartedError extends DomainError {
  constructor() {
    super('Fleet trip has already started', 'CONSTRAINT_VIOLATION');
  }
}

export class FleetAlreadyFinishedError extends DomainError {
  constructor() {
    super('Fleet has already finished', 'CONSTRAINT_VIOLATION');
  }
}

export class FleetRemoveMemberNotAllowed extends DomainError {
  constructor() {
    super(
      'Fleet member can only be remove while the fleet is in formation',
      'CONSTRAINT_VIOLATION',
    );
  }
}

export class NotEnoughMembersInFleet extends DomainError {
  constructor() {
    super('Not enough members in fleet', 'CONSTRAINT_VIOLATION');
  }
}
