import { Router } from 'express';
import { createDoctor, getAllDoctors, getDoctorById, deleteDoctorById, updateDoctorById } from '../../controller/admin/doctor.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create', authenticate(['admin']), createDoctor);
router.get('/', authenticate(['admin']), getAllDoctors);
router.get('/:id', authenticate(['admin']), getDoctorById);
router.delete('/:id', authenticate(['admin']), deleteDoctorById);
router.put('/:id', authenticate(['admin']), updateDoctorById); // New route for PUT

export default router;
