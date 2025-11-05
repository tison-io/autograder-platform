import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecipesController } from './recipe.controller';
import { RecipesService } from './recipe.service';

@Module({
  imports: [HttpModule.register({})],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
