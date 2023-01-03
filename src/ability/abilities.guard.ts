import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { currentUser } from 'src/user/current-user';
import { User } from 'src/user/entities/user.entity';
import { CHECK_ABILITY, RequiredRules } from './abilities.decorator';
import { AbilityFactory } from './ability.factory.ts';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactior: AbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRules[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    const user: User = currentUser;
    
    // TODO: get user from request
    // const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactior.defineAbility(user);

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
