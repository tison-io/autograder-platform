// src/chat/chat.controller.ts
import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(
    @Body(ValidationPipe) chatRequestDto: ChatRequestDto,
    
  ): Promise<ChatResponseDto> {
   
    const userId = 'temp-user-id';
    return await this.chatService.getResponse(chatRequestDto, userId);
  }

}