import { Router } from 'express';
import {  createUser,  
    loginUser, 
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,} 
    from '../controller/admin/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', authenticate(['admin']),getAllUsers);
router.get('/:id', authenticate(['admin']), getUserById);
router.delete('/:id',authenticate(['admin']),deleteUser)
router.put('/:id',authenticate(['admin']),updateUser)
export default router;
