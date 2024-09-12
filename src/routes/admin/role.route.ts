import { Router } from 'express';
import { createRole } from '../../controller/admin/role.controller';

const router = Router();

// Route to create a new role
router.post('/create', createRole);

export default router;
