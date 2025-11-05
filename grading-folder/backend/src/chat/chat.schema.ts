// src/chat/schemas/chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, enum: ['user', 'assistant'] })
  role!: 'user' | 'assistant';

  @Prop({ required: true })
  content!: string;

  @Prop({ type: String })
  sessionId?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);


ChatSchema.index({ userId: 1, createdAt: -1 });
ChatSchema.index({ sessionId: 1 });