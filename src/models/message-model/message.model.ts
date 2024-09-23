// models/Message.ts
import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
}

const messageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;
