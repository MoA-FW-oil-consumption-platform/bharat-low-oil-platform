import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  platform: Joi.string().valid('web', 'mobile').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  platform: Joi.string().valid('web', 'mobile').optional(),
});

const oauthSchema = Joi.object({
  provider: Joi.string().valid('google').required(),
  platform: Joi.string().valid('web', 'mobile').required(),
  redirectTo: Joi.string().uri().optional(),
});

const oauthCallbackSchema = Joi.object({
  access_token: Joi.string().required(),
  refresh_token: Joi.string().required(),
  platform: Joi.string().valid('web', 'mobile').optional(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error: validationError, value } = registerSchema.validate(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError.details[0].message });
      return;
    }

    const { email, password, fullName, platform = 'web' } = value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          platform,
        },
        emailRedirectTo: platform === 'mobile' 
          ? 'bharatlowoil://auth/callback' 
          : `${process.env.WEB_URL}/auth/callback`,
      },
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Generate JWT token for both platforms
    if (data.user) {
      const payload: jwt.JwtPayload = {
        userId: data.user.id,
        email: data.user.email,
        platform,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: String(process.env.JWT_EXPIRES_IN || "7d"),
      });

      res.status(201).json({
        message: "Registration successful",
        user: data.user,
        session: data.session,
        token,
        platform,
      });
    } else {
      res.status(201).json({
        message: "Registration successful. Please verify your email.",
        user: data.user,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error: validationError, value } = loginSchema.validate(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError.details[0].message });
      return;
    }

    const { email, password, platform = 'web' } = value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT for API Gateway
    const payload: jwt.JwtPayload = {
      userId: data.user.id,
      email: data.user.email,
      platform,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: String(process.env.JWT_EXPIRES_IN || "7d"),
    });

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session,
      token,
      platform,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refresh_token, platform = 'web' } = req.body;

    if (!refresh_token) {
      res.status(400).json({ error: "Refresh token required" });
      return;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const payload: jwt.JwtPayload = {
      userId: data.user?.id,
      email: data.user?.email,
      platform,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: String(process.env.JWT_EXPIRES_IN || "7d"),
    });

    res.json({
      session: data.session,
      token,
      platform,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret"
    );

    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
};

// Google OAuth - Initiate OAuth flow
export const initiateOAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error: validationError, value } = oauthSchema.validate(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError.details[0].message });
      return;
    }

    const { provider, platform, redirectTo } = value;

    // Determine redirect URL based on platform
    const defaultRedirectTo = platform === 'mobile'
      ? 'bharatlowoil://auth/callback'
      : `${process.env.WEB_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google',
      options: {
        redirectTo: redirectTo || defaultRedirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      url: data.url,
      provider: data.provider,
      platform,
    });
  } catch (error) {
    console.error("OAuth initiation error:", error);
    res.status(500).json({ error: "OAuth initiation failed" });
  }
};

// Handle OAuth callback
export const handleOAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error: validationError, value } = oauthCallbackSchema.validate(req.body);

    if (validationError) {
      res.status(400).json({ error: validationError.details[0].message });
      return;
    }

    const { access_token, refresh_token, platform = 'web' } = value;

    // Set the session using the tokens from OAuth callback
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error || !data.user) {
      res.status(400).json({ error: error?.message || "Invalid OAuth tokens" });
      return;
    }

    // Generate JWT for API Gateway
    const payload: jwt.JwtPayload = {
      userId: data.user.id,
      email: data.user.email,
      platform,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: String(process.env.JWT_EXPIRES_IN || "7d"),
    });

    res.json({
      message: "OAuth login successful",
      user: data.user,
      session: data.session,
      token,
      platform,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
};

// Get current user session
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret"
    ) as jwt.JwtPayload;

    // Get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid token or user not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        created_at: user.created_at,
      },
      platform: decoded.platform || 'web',
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
