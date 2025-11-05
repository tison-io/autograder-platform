import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipe.service';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}
  
  @Get('search')
  async search(@Query() query: SearchRecipeDto) {  
    console.log('Recipe search endpoint hit with query:', query);
    return this.recipesService.searchRecipes(query);
  }
  
  @Get('test')
  async test() {
    return {
      message: 'Recipe controller is working!',
      timestamp: new Date().toISOString(),
    };
  }
}