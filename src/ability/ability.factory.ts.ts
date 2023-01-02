import { InferSubjects } from "@casl/ability";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability/dist/types";
import { Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";

export enum Action {
    Manage = 'manage', // wildcard for any action
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

// export type Subjects = InferSubjects<typeof User | typeof Post | typeof Comment> | 'all';  // <-- add more entities
export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        // define rules
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.isAdmin) {
            can(Action.Manage, 'all')
        }
        can(Action.Read, 'all')

        return build({ detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects> })
    }
}
