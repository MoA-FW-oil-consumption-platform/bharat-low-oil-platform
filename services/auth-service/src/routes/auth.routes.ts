import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refreshToken, 
  verifyToken,
  initiateOAuth,
  handleOAuthCallback,
  getCurrentUser
} from '../controllers/auth.controller';

const router = Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/verify', verifyToken);

// OAuth Authentication
router.post('/oauth/initiate', initiateOAuth);
router.post('/oauth/callback', handleOAuthCallback);

// User Info
router.get('/me', getCurrentUser);

export default router;
