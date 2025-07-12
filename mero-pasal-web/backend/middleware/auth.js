const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Subscription Tier Middleware
const requireSubscription = (requiredTier = "basic") => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get user's current subscription
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("tier, status, expires_at")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (error || !subscription) {
        return res.status(403).json({
          error: "Active subscription required",
          message: "Please subscribe to access this feature",
        });
      }

      // Check if subscription is expired
      if (
        subscription.expires_at &&
        new Date(subscription.expires_at) < new Date()
      ) {
        return res.status(403).json({
          error: "Subscription expired",
          message: "Your subscription has expired. Please renew to continue.",
        });
      }

      // Check tier access
      if (requiredTier === "pro" && subscription.tier !== "pro") {
        return res.status(403).json({
          error: "Pro subscription required",
          message: "This feature requires a Pro subscription",
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error("Subscription check error:", error);
      res.status(500).json({ error: "Error checking subscription status" });
    }
  };
};

// Feature Access Logger
const logFeatureAccess = async (req, res, next) => {
  try {
    if (req.user && req.subscription) {
      await supabase.from("user_access_logs").insert({
        user_id: req.user.id,
        feature_accessed: req.route.path,
        subscription_tier: req.subscription.tier,
      });
    }
    next();
  } catch (error) {
    console.error("Access logging error:", error);
    next(); // Don't block the request if logging fails
  }
};

module.exports = {
  authenticateToken,
  requireSubscription,
  logFeatureAccess,
};
