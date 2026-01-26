import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RubricsService } from './rubrics.service';
import { CreateRubricWithCriteriaDto, UpdateRubricDto, RubricResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@autograder/database';

@ApiTags('Rubrics')
@ApiBearerAuth('JWT-auth')
@Controller('rubrics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RubricsController {
  constructor(private readonly rubricsService: RubricsService) {}

  @Post()
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Create a new rubric with criteria (Professor only)' })
  @ApiResponse({ status: 201, description: 'Rubric created', type: RubricResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  async create(@Body() createRubricDto: CreateRubricWithCriteriaDto): Promise<RubricResponseDto> {
    return this.rubricsService.create(createRubricDto);
  }

  @Post('upload')
  @Roles(UserRole.PROFESSOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload rubric from JSON file (Professor only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JSON file containing rubric configuration',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Rubric created from JSON', type: RubricResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid JSON file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  async uploadJson(@UploadedFile() file: Express.Multer.File): Promise<RubricResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.match(/\.json$/i)) {
      throw new BadRequestException('File must be a JSON file');
    }

    const jsonContent = file.buffer.toString('utf-8');
    return this.rubricsService.uploadFromJson(jsonContent);
  }

  @Get()
  @ApiOperation({ summary: 'List all rubrics' })
  @ApiResponse({ status: 200, description: 'List of rubrics', type: [RubricResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<RubricResponseDto[]> {
    return this.rubricsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rubric by ID with criteria' })
  @ApiParam({ name: 'id', description: 'Rubric ID' })
  @ApiResponse({ status: 200, description: 'Rubric found', type: RubricResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rubric not found' })
  async findOne(@Param('id') id: string): Promise<RubricResponseDto> {
    return this.rubricsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update rubric (Professor only)' })
  @ApiParam({ name: 'id', description: 'Rubric ID' })
  @ApiResponse({ status: 200, description: 'Rubric updated', type: RubricResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  @ApiResponse({ status: 404, description: 'Rubric not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRubricDto: UpdateRubricDto,
  ): Promise<RubricResponseDto> {
    return this.rubricsService.update(id, updateRubricDto);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Delete rubric (Professor only)' })
  @ApiParam({ name: 'id', description: 'Rubric ID' })
  @ApiResponse({ status: 200, description: 'Rubric deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  @ApiResponse({ status: 404, description: 'Rubric not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rubricsService.remove(id);
  }
}
