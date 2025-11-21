import { Router } from 'express';
import {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  getUserCertificates
} from '../controllers/certificate.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/:moduleId/generate', authenticateToken, generateCertificate);
router.get('/:moduleId', authenticateToken, getCertificate);
router.get('/verify/:certificateId', verifyCertificate); // Public endpoint
router.get('/user/all', authenticateToken, getUserCertificates);

export default router;
