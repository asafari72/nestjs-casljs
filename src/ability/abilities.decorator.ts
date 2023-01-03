import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './ability.factory.ts';

export interface RequiredRules {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRules[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
