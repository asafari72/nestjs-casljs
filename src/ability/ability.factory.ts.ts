import { InferSubjects } from '@casl/ability';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export enum Action {
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// export type Subjects = InferSubjects<typeof User | typeof Post | typeof Comment> | 'all';  // <-- add more entities
export type Subjects = InferSubjects<typeof User> | 'all';

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    // define rules
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.isAdmin) {
      can(Action.Manage, 'all');
      console.log(user.id);

      cannot(Action.Manage, User, { id: { $ne: user.id } }).because(
        'You can only manage users in your own organization',
      );
    }
    can(Action.Read, 'all');
    cannot(Action.Create, User).because('your special message: only admins!!!');
    cannot(Action.Delete, User).because('you just cant');

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
