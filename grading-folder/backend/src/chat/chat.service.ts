// src/chat/chat.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Chat, ChatDocument } from './chat.schema';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getResponse(chatRequestDto: ChatRequestDto, userId: string): Promise<ChatResponseDto> {
    const { message, history } = chatRequestDto;

    try {
      
      const userMessage = new this.chatModel({
        userId,
        role: 'user',
        content: message,
        sessionId: this.generateSessionId(),
      });
      await userMessage.save();

     
      let contextPrompt = `You are a helpful nutrition assistant specializing in dietary advice, meal planning, healthy eating habits, calorie counting, and general nutrition guidance. 

You should:
- Provide accurate, evidence-based nutrition information
- Be encouraging and supportive
- Give practical, actionable advice
- Ask clarifying questions when needed
- Recommend consulting healthcare professionals for medical conditions

User question: ${message}`;

      if (history && history.length > 0) {
        const conversationContext = history
          .slice(-5) 
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n');
        
        contextPrompt = `Previous conversation:\n${conversationContext}\n\n${contextPrompt}`;
      }


      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const aiResponse = response.text();

    
      const assistantMessage = new this.chatModel({
        userId,
        role: 'assistant',
        content: aiResponse,
        sessionId: userMessage.sessionId,
      });
      await assistantMessage.save();

      return {
        response: aiResponse,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new HttpException(
        'Failed to get response from AI assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChatHistory(userId: string, limit: number = 50) {
    try {
      const messages = await this.chatModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-__v')
        .lean();

      return {
        messages: messages.reverse(), 
        count: messages.length,
      };
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw new HttpException(
        'Failed to fetch chat history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserSessions(userId: string) {
    try {
      const sessions = await this.chatModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$sessionId',
            lastMessage: { $last: '$content' },
            messageCount: { $sum: 1 },
            lastUpdated: { $max: '$createdAt' },
          },
        },
        { $sort: { lastUpdated: -1 } },
      ]);

      return {
        sessions,
        count: sessions.length,
      };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw new HttpException(
        'Failed to fetch user sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}