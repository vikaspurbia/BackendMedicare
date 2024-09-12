// controllers/messageController.ts
import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import Message from '../models/admin/message.model';

// Define Zod schema for validation
const messageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});


export const createMessage = async (req: Request, res: Response) => {
  try {
    // Validate request body
    messageSchema.parse(req.body);

    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error saving message' });
    }
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find()
    res.json(messages.map(message => ({ 
      id: message._id,  // Include the MongoDB _id as id 
      name: message.name, 
      email: message.email, 
      message: message.message 
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};



export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const message = await Message.findByIdAndUpdate(id, updatedData, { new: true });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error });
  }
};