import { Module } from '@nestjs/common';
import { RubricsController } from './rubrics.controller';
import { RubricsService } from './rubrics.service';
import { RubricValidationService } from './rubric-validation.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RubricsController],
  providers: [RubricsService, RubricValidationService],
  exports: [RubricsService],
})
export class RubricsModule {}
