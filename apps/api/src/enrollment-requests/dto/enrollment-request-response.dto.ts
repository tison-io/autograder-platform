import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentRequestStatus } from '@autograder/database';

class StudentInfoDto {
  @ApiProperty({ description: 'Student ID' })
  id: string;

  @ApiProperty({ description: 'Student email' })
  email: string;

  @ApiProperty({ description: 'Student first name' })
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  lastName: string;

  @ApiProperty({ description: 'GitHub username', required: false })
  githubUsername?: string;
}

class CourseInfoDto {
  @ApiProperty({ description: 'Course ID' })
  id: string;

  @ApiProperty({ description: 'Course code' })
  code: string;

  @ApiProperty({ description: 'Course name' })
  name: string;
}

export class EnrollmentRequestResponseDto {
  @ApiProperty({ description: 'Request ID' })
  id: string;

  @ApiProperty({ description: 'Request status', enum: EnrollmentRequestStatus })
  status: EnrollmentRequestStatus;

  @ApiProperty({ description: 'Optional message from student', required: false })
  message?: string;

  @ApiProperty({ description: 'Student ID' })
  studentId: string;

  @ApiProperty({ description: 'Student information', type: StudentInfoDto })
  student: StudentInfoDto;

  @ApiProperty({ description: 'Course ID' })
  courseId: string;

  @ApiProperty({ description: 'Course information', type: CourseInfoDto })
  course: CourseInfoDto;

  @ApiProperty({ description: 'Request creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
