const express = require("express");
const bcrypt = require("bcryptjs");
const { supabase } = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, companyName, phone } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (companyName !== undefined) updateData.company_name = companyName;
    if (phone !== undefined) updateData.phone = phone;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("id, email, full_name, company_name, phone, created_at")
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({
        error: "Update failed",
        message: "Could not update profile",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not update profile",
    });
  }
});

// Change password
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Missing fields",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "Invalid password",
        message: "New password must be at least 8 characters long",
      });
    }

    // Get current user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        error: "User not found",
        message: "Could not verify current password",
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid password",
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newPasswordHash })
      .eq("id", userId);

    if (updateError) {
      console.error("Password update error:", updateError);
      return res.status(500).json({
        error: "Update failed",
        message: "Could not update password",
      });
    }

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not update password",
    });
  }
});

// Get user activity logs
router.get("/activity", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const { data: logs, error } = await supabase
      .from("user_access_logs")
      .select("*")
      .eq("user_id", userId)
      .order("access_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Activity logs error:", error);
      return res.status(500).json({
        error: "Database error",
        message: "Could not retrieve activity logs",
      });
    }

    res.json({
      logs: logs || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Activity logs error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not retrieve activity logs",
    });
  }
});

module.exports = router;
