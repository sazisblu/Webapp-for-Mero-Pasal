const express = require("express");
const { supabase } = require("../config/supabase");
const {
  authenticateToken,
  requireSubscription,
  logFeatureAccess,
} = require("../middleware/auth");

const router = express.Router();

// Get market insights (Pro feature)
router.get(
  "/",
  authenticateToken,
  requireSubscription("pro"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const {
        product_id,
        insight_type,
        region,
        limit = 10,
        offset = 0,
      } = req.query;

      let query = supabase
        .from("market_insights")
        .select(
          `
          *,
          products (
            id,
            name,
            category,
            subcategory
          )
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (product_id) {
        query = query.eq("product_id", product_id);
      }
      if (insight_type) {
        query = query.eq("insight_type", insight_type);
      }
      if (region) {
        query = query.eq("region", region);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: insights, error } = await query;

      if (error) {
        console.error("Insights fetch error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve market insights",
        });
      }

      res.json({
        insights: insights || [],
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: insights?.length || 0,
        },
      });
    } catch (error) {
      console.error("Market insights error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve market insights",
      });
    }
  }
);

// Get insight by ID (Pro feature)
router.get(
  "/:id",
  authenticateToken,
  requireSubscription("pro"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data: insight, error } = await supabase
        .from("market_insights")
        .select(
          `
          *,
          products (
            id,
            name,
            category,
            subcategory,
            description
          )
        `
        )
        .eq("id", id)
        .single();

      if (error || !insight) {
        return res.status(404).json({
          error: "Insight not found",
          message: "The requested market insight could not be found",
        });
      }

      res.json({ insight });
    } catch (error) {
      console.error("Insight fetch error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve market insight",
      });
    }
  }
);

// Get insights summary (Pro feature)
router.get(
  "/summary/overview",
  authenticateToken,
  requireSubscription("pro"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const { region } = req.query;

      // Get insights by type
      let query = supabase
        .from("market_insights")
        .select("insight_type, confidence_score, created_at");

      if (region) {
        query = query.eq("region", region);
      }

      const { data: insights, error } = await query.gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      );

      if (error) {
        console.error("Insights summary error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve insights summary",
        });
      }

      // Process insights summary
      const summary = {
        total_insights: insights?.length || 0,
        by_type: {},
        average_confidence: 0,
        latest_update: null,
      };

      if (insights && insights.length > 0) {
        // Group by type
        insights.forEach((insight) => {
          if (!summary.by_type[insight.insight_type]) {
            summary.by_type[insight.insight_type] = 0;
          }
          summary.by_type[insight.insight_type]++;
        });

        // Calculate average confidence
        const validConfidences = insights.filter(
          (i) => i.confidence_score !== null
        );
        if (validConfidences.length > 0) {
          summary.average_confidence =
            validConfidences.reduce(
              (sum, i) => sum + parseFloat(i.confidence_score),
              0
            ) / validConfidences.length;
        }

        // Get latest update
        summary.latest_update = insights.reduce((latest, current) => {
          return new Date(current.created_at) > new Date(latest.created_at)
            ? current
            : latest;
        }).created_at;
      }

      res.json({ summary });
    } catch (error) {
      console.error("Insights summary error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve insights summary",
      });
    }
  }
);

// Get insights by product category (Pro feature)
router.get(
  "/category/:category",
  authenticateToken,
  requireSubscription("pro"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = 5 } = req.query;

      const { data: insights, error } = await supabase
        .from("market_insights")
        .select(
          `
          *,
          products!inner (
            id,
            name,
            category,
            subcategory
          )
        `
        )
        .eq("products.category", category)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Category insights error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve category insights",
        });
      }

      res.json({
        category,
        insights: insights || [],
      });
    } catch (error) {
      console.error("Category insights error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve category insights",
      });
    }
  }
);

module.exports = router;
