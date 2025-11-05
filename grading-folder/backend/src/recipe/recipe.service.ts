import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly httpService: HttpService) {}

  async searchRecipes(searchDto: SearchRecipeDto) {
    try {
      const { query, diet, type, maxReadyTime, number = 12 } = searchDto;
      
      if (!query) {
        throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
      }

      const apiKey = process.env.SPOONACULAR_API_KEY || 'your-api-key-here';
      
      if (apiKey === 'your-api-key-here') {
        throw new HttpException('Spoonacular API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const params = new URLSearchParams({
        apiKey,
        query,
        number: number.toString(),
        addRecipeInformation: 'true', 
        fillIngredients: 'true', 
        addRecipeInstructions: 'true', 
      });

      if (diet) params.append('diet', diet);
      if (type) params.append('type', type);
      if (maxReadyTime) params.append('maxReadyTime', maxReadyTime.toString());

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params}`;
      
      console.log('Calling Spoonacular API:', url.replace(apiKey, '[HIDDEN]'));

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
        })
      );

      console.log('Spoonacular API response received:', {
        status: response.status,
        resultCount: response.data.results?.length || 0
      });

      
      const processedResults = await this.processRecipeResults(response.data.results || [], apiKey);

      return {
        results: processedResults,
        totalResults: response.data.totalResults || 0,
        query: query,
      };

    } catch (error: any) {
      console.error('Recipe search error:', error.response?.data || error.message);
      
      if (error.response?.status === 402) {
        throw new HttpException(
          'Recipe service quota exceeded. Please try again later.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      
      if (error.response?.status === 401) {
        throw new HttpException(
          'Recipe service authentication failed. Please check API key.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'Recipe service timeout. Please try again.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      throw new HttpException(
        `Failed to search recipes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  
  private async processRecipeResults(results: any[], apiKey: string) {
    const processedResults: any[] = [];

    for (const recipe of results) {
      try {
    
        if (!recipe.extendedIngredients || !recipe.instructions) {
          console.log(`Fetching detailed info for recipe ID: ${recipe.id}`);
          
          const detailedRecipe = await this.getRecipeById(recipe.id);
          
          
          processedResults.push({
            ...recipe,
            extendedIngredients: detailedRecipe.extendedIngredients || recipe.extendedIngredients,
            instructions: detailedRecipe.instructions || recipe.instructions,
            sourceUrl: detailedRecipe.sourceUrl || recipe.sourceUrl,
          });
        } else {
          processedResults.push(recipe);
        }
      } catch (error: any) {
        console.warn(`Failed to fetch detailed info for recipe ${recipe.id}:`, error.message);
        
        processedResults.push(recipe);
      }
    }

    return processedResults;
  }

  async getRecipeById(id: number) {
    try {
      const apiKey = process.env.SPOONACULAR_API_KEY || 'your-api-key-here';
      
      if (apiKey === 'your-api-key-here') {
        throw new HttpException('Spoonacular API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const params = new URLSearchParams({
        apiKey,
        includeNutrition: 'false',
      });

      const url = `https://api.spoonacular.com/recipes/${id}/information?${params}`;
      
      console.log('Fetching recipe details:', url.replace(apiKey, '[HIDDEN]'));

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
        })
      );

      console.log('Recipe details received:', {
        status: response.status,
        recipeId: response.data.id,
        title: response.data.title
      });

      return response.data;

    } catch (error: any) {
      console.error('Recipe details error:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
      }
      
      if (error.response?.status === 402) {
        throw new HttpException(
          'Recipe service quota exceeded. Please try again later.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      
      if (error.response?.status === 401) {
        throw new HttpException(
          'Recipe service authentication failed. Please check API key.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      throw new HttpException(
        `Failed to fetch recipe details: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
