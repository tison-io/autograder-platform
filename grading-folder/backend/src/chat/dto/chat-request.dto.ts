// src/chat/dto/chat-request.dto.ts
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class MessageHistoryDto {
  @IsString()
    id!: string;

  @IsString()
    role!: 'user' | 'assistant';

  @IsString()
    content!: string;

  @IsString()
    timestamp!: string;
}

export class ChatRequestDto {
  @IsNotEmpty({ message: 'Message is required' })
    @IsString({ message: 'Message must be a string' })
    message!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageHistoryDto)
  history?: MessageHistoryDto[];
}