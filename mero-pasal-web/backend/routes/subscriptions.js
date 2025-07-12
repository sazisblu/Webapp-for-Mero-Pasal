const express = require("express");
const { supabase } = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get user's subscription status
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Subscription fetch error:", error);
      return res.status(500).json({
        error: "Database error",
        message: "Could not retrieve subscription status",
      });
    }

    const features = getFeaturesByTier(subscription?.tier || "basic");
    const isExpired =
      subscription?.expires_at &&
      new Date(subscription.expires_at) < new Date();

    res.json({
      subscription: subscription || null,
      features,
      isExpired: isExpired || false,
      tier: subscription?.tier || "basic",
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not retrieve subscription status",
    });
  }
});

// Upgrade to Pro subscription
router.post("/upgrade", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check current subscription
    const { data: currentSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (currentSub?.tier === "pro") {
      return res.status(400).json({
        error: "Already subscribed",
        message: "You already have a Pro subscription",
      });
    }

    // Deactivate current subscription
    if (currentSub) {
      await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", currentSub.id);
    }

    // Create new Pro subscription
    const { data: newSubscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        tier: "pro",
        status: "active",
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      })
      .select()
      .single();

    if (error) {
      console.error("Subscription upgrade error:", error);
      return res.status(500).json({
        error: "Upgrade failed",
        message: "Could not process subscription upgrade",
      });
    }

    const features = getFeaturesByTier("pro");

    res.json({
      message: "Successfully upgraded to Pro",
      subscription: newSubscription,
      features,
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not process upgrade",
    });
  }
});

// Downgrade to Basic subscription
router.post("/downgrade", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check current subscription
    const { data: currentSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (!currentSub || currentSub.tier === "basic") {
      return res.status(400).json({
        error: "Invalid request",
        message: "You are already on the Basic plan",
      });
    }

    // Update subscription to basic
    const { data: updatedSubscription, error } = await supabase
      .from("subscriptions")
      .update({
        tier: "basic",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      })
      .eq("id", currentSub.id)
      .select()
      .single();

    if (error) {
      console.error("Subscription downgrade error:", error);
      return res.status(500).json({
        error: "Downgrade failed",
        message: "Could not process subscription downgrade",
      });
    }

    const features = getFeaturesByTier("basic");

    res.json({
      message: "Successfully downgraded to Basic",
      subscription: updatedSubscription,
      features,
    });
  } catch (error) {
    console.error("Subscription downgrade error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not process downgrade",
    });
  }
});

// Cancel subscription
router.post("/cancel", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      console.error("Subscription cancellation error:", error);
      return res.status(500).json({
        error: "Cancellation failed",
        message: "Could not cancel subscription",
      });
    }

    res.json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not cancel subscription",
    });
  }
});

// Get subscription tiers and pricing
router.get("/tiers", (req, res) => {
  const tiers = {
    basic: {
      name: "Basic",
      price: 0,
      currency: "NPR",
      duration: "month",
      features: getFeaturesByTier("basic"),
      description: "Perfect for getting started with market insights",
    },
    pro: {
      name: "Pro",
      price: 2999,
      currency: "NPR",
      duration: "month",
      features: getFeaturesByTier("pro"),
      description: "Advanced insights and analytics for serious producers",
    },
  };

  res.json({ tiers });
});

// Helper function to get features by tier
function getFeaturesByTier(tier) {
  const features = {
    basic: [
      "Basic market graphs",
      "Sales volume charts",
      "Price trend visualization",
      "Monthly reports",
      "Email support",
    ],
    pro: [
      "Everything in Basic",
      "Detailed market insights",
      "Advanced analytics",
      "Market predictions",
      "Competitor analysis",
      "Real-time data updates",
      "Custom reports",
      "Priority support",
      "API access",
    ],
  };

  return features[tier] || features.basic;
}

module.exports = router;
