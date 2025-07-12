const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, companyName, phone } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Email, password, and full name are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password",
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        company_name: companyName || null,
        phone: phone || null,
      })
      .select("id, email, full_name, company_name, phone, created_at")
      .single();

    if (userError) {
      console.error("User creation error:", userError);
      return res.status(500).json({
        error: "Failed to create user",
        message: "Please try again later",
      });
    }

    // Create default basic subscription
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: newUser.id,
        tier: "basic",
        status: "active",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

    if (subscriptionError) {
      console.error("Subscription creation error:", subscriptionError);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Please try again later",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required",
      });
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        "id, email, password_hash, full_name, company_name, phone, email_verified"
      )
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier, status, expires_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      subscription: subscription || null,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Please try again later",
    });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, email, full_name, company_name, phone, email_verified, created_at"
      )
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile could not be retrieved",
      });
    }

    // Get subscription info
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier, status, expires_at, created_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    res.json({
      user,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not retrieve profile",
    });
  }
});

// Refresh token
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not refresh token",
    });
  }
});

module.exports = router;
