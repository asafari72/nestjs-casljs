import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory.ts';

@Module({
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class AbilityModule { }
