const express = require("express");
const { supabase } = require("../config/supabase");
const {
  authenticateToken,
  requireSubscription,
  logFeatureAccess,
} = require("../middleware/auth");

const router = express.Router();

// Get analytics data for graphs (Basic feature)
router.get(
  "/graphs",
  authenticateToken,
  requireSubscription("basic"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const {
        product_id,
        metric_type = "sales_volume",
        region,
        days = 30,
      } = req.query;

      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      let query = supabase
        .from("analytics_data")
        .select(
          `
          *,
          products (
            id,
            name,
            category
          )
        `
        )
        .eq("metric_type", metric_type)
        .gte("date_recorded", startDate.toISOString().split("T")[0])
        .order("date_recorded", { ascending: true });

      if (product_id) {
        query = query.eq("product_id", product_id);
      }
      if (region) {
        query = query.eq("region", region);
      }

      const { data: analytics, error } = await query;

      if (error) {
        console.error("Analytics fetch error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve analytics data",
        });
      }

      // Format data for charts
      const chartData = formatChartData(analytics, metric_type);

      res.json({
        data: chartData,
        metadata: {
          metric_type,
          days: parseInt(days),
          total_records: analytics?.length || 0,
          date_range: {
            start: startDate.toISOString().split("T")[0],
            end: new Date().toISOString().split("T")[0],
          },
        },
      });
    } catch (error) {
      console.error("Analytics graphs error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve analytics data",
      });
    }
  }
);

// Get advanced analytics (Pro feature)
router.get(
  "/advanced",
  authenticateToken,
  requireSubscription("pro"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const { product_id, region, days = 90 } = req.query;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Build query
      let query = supabase
        .from("analytics_data")
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
        .gte("date_recorded", startDate.toISOString().split("T")[0])
        .order("date_recorded", { ascending: true });

      if (product_id) {
        query = query.eq("product_id", product_id);
      }
      if (region) {
        query = query.eq("region", region);
      }

      const { data: analytics, error } = await query;

      if (error) {
        console.error("Advanced analytics error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve advanced analytics",
        });
      }

      // Process advanced analytics
      const processedData = processAdvancedAnalytics(analytics);

      res.json({
        advanced_analytics: processedData,
        metadata: {
          days: parseInt(days),
          total_records: analytics?.length || 0,
          analysis_date: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Advanced analytics error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve advanced analytics",
      });
    }
  }
);

// Get dashboard summary (Basic feature)
router.get(
  "/dashboard/summary",
  authenticateToken,
  requireSubscription("basic"),
  logFeatureAccess,
  async (req, res) => {
    try {
      const { region } = req.query;
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Get recent analytics data
      let query = supabase
        .from("analytics_data")
        .select("metric_type, value, date_recorded, products(name, category)")
        .gte("date_recorded", weekAgo);

      if (region) {
        query = query.eq("region", region);
      }

      const { data: recentData, error } = await query;

      if (error) {
        console.error("Dashboard summary error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Could not retrieve dashboard summary",
        });
      }

      // Process summary statistics
      const summary = {
        total_products:
          new Set(recentData?.map((d) => d.products?.name)).size || 0,
        total_data_points: recentData?.length || 0,
        latest_update:
          recentData?.length > 0
            ? recentData.reduce((latest, current) =>
                new Date(current.date_recorded) > new Date(latest.date_recorded)
                  ? current
                  : latest
              ).date_recorded
            : null,
        metrics_summary: {},
      };

      // Group by metric type
      if (recentData && recentData.length > 0) {
        recentData.forEach((item) => {
          if (!summary.metrics_summary[item.metric_type]) {
            summary.metrics_summary[item.metric_type] = {
              count: 0,
              average: 0,
              total: 0,
            };
          }
          summary.metrics_summary[item.metric_type].count++;
          summary.metrics_summary[item.metric_type].total += parseFloat(
            item.value
          );
        });

        // Calculate averages
        Object.keys(summary.metrics_summary).forEach((metric) => {
          const data = summary.metrics_summary[metric];
          data.average = data.total / data.count;
        });
      }

      res.json({ summary });
    } catch (error) {
      console.error("Dashboard summary error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not retrieve dashboard summary",
      });
    }
  }
);

// Get products list
router.get("/products", authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase.from("products").select("*").order("name");

    if (category) {
      query = query.eq("category", category);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error("Products fetch error:", error);
      return res.status(500).json({
        error: "Database error",
        message: "Could not retrieve products",
      });
    }

    res.json({ products: products || [] });
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not retrieve products",
    });
  }
});

// Helper function to format chart data
function formatChartData(analytics, metricType) {
  if (!analytics || analytics.length === 0) return [];

  // Group by date and aggregate
  const groupedData = analytics.reduce((acc, item) => {
    const date = item.date_recorded;
    if (!acc[date]) {
      acc[date] = {
        date,
        total: 0,
        count: 0,
        products: new Set(),
      };
    }
    acc[date].total += parseFloat(item.value);
    acc[date].count++;
    acc[date].products.add(item.products?.name || "Unknown");
    return acc;
  }, {});

  // Convert to array and calculate averages
  return Object.values(groupedData).map((item) => ({
    date: item.date,
    value: item.total,
    average: item.total / item.count,
    product_count: item.products.size,
    data_points: item.count,
  }));
}

// Helper function to process advanced analytics
function processAdvancedAnalytics(analytics) {
  if (!analytics || analytics.length === 0) {
    return {
      trends: {},
      correlations: {},
      predictions: {},
      insights: [],
    };
  }

  // Group by metric type and product
  const groupedData = analytics.reduce((acc, item) => {
    const key = `${item.metric_type}_${item.product_id}`;
    if (!acc[key]) {
      acc[key] = {
        metric_type: item.metric_type,
        product: item.products,
        data: [],
      };
    }
    acc[key].data.push({
      date: item.date_recorded,
      value: parseFloat(item.value),
    });
    return acc;
  }, {});

  // Calculate trends and statistics
  const processedData = {
    trends: {},
    statistics: {},
    top_performers: [],
    insights: [],
  };

  Object.keys(groupedData).forEach((key) => {
    const group = groupedData[key];
    if (group.data.length > 1) {
      // Calculate trend
      const trend = calculateTrend(group.data);
      processedData.trends[key] = {
        product: group.product?.name || "Unknown",
        metric: group.metric_type,
        trend_direction: trend.direction,
        trend_strength: trend.strength,
        change_percentage: trend.changePercentage,
      };

      // Calculate statistics
      const values = group.data.map((d) => d.value);
      processedData.statistics[key] = {
        product: group.product?.name || "Unknown",
        metric: group.metric_type,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        volatility: calculateVolatility(values),
      };
    }
  });

  return processedData;
}

// Helper function to calculate trend
function calculateTrend(data) {
  if (data.length < 2)
    return { direction: "stable", strength: 0, changePercentage: 0 };

  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const changePercentage = ((lastValue - firstValue) / firstValue) * 100;

  let direction = "stable";
  if (changePercentage > 5) direction = "increasing";
  else if (changePercentage < -5) direction = "decreasing";

  const strength = Math.abs(changePercentage) / 100;

  return {
    direction,
    strength: Math.min(strength, 1),
    changePercentage: parseFloat(changePercentage.toFixed(2)),
  };
}

// Helper function to calculate volatility
function calculateVolatility(values) {
  if (values.length < 2) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;

  return Math.sqrt(variance);
}

module.exports = router;
