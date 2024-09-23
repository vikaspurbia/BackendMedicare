import express from 'express';
import { getMessages, createMessage, deleteMessage, updateMessage } from '../controller/message.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/create-message', authenticate(['admin']), createMessage);

router.get('/', authenticate(['admin']), getMessages);
router.delete('/messages/:id', authenticate(['admin']), deleteMessage);
router.put('/messages/:id', authenticate(['admin']), updateMessage);

export default router;
