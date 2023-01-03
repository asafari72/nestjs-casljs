import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY, RequiredRules } from "./abilities.decorator";
import { AbilityFactory } from "./ability.factory.ts";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactior: AbilityFactory
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const rules = this.reflector.get<RequiredRules[]>(CHECK_ABILITY, context.getHandler()) || [];

        const { user } = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactior.defineAbility(user);

        try {
            rules.forEach((rule) =>
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
            )
            return true
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
        }
    }
}