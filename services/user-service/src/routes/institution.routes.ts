import express from 'express';
import {
  createInstitution,
  getInstitutionById,
  getInstitutions,
  updateInstitution,
  verifyInstitution,
  deleteInstitution
} from '../controllers/institution.controller';

const router = express.Router();

/**
 * Institution Management Routes
 */

// Create institution
router.post('/', createInstitution);

// Get all institutions (with filters)
router.get('/', getInstitutions);

// Get institution by ID
router.get('/:id', getInstitutionById);

// Update institution
router.put('/:id', updateInstitution);

// Verify institution (admin only)
router.post('/:id/verify', verifyInstitution);

// Delete institution
router.delete('/:id', deleteInstitution);

export default router;
