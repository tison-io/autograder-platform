import { Module } from '@nestjs/common';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { EnrollmentRequestsController } from './enrollment-requests.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnrollmentRequestsController],
  providers: [EnrollmentRequestsService],
  exports: [EnrollmentRequestsService],
})
export class EnrollmentRequestsModule {}
