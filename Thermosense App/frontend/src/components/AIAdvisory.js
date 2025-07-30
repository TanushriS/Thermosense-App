import React, { useState } from "react";

const AIAdvisory = ({ isVisible, healthData }) => {
  const [customAnalysis, setCustomAnalysis] = useState({
    deviceTemp: "",
    ambientTemp: "",
    batteryLevel: "",
    usage: "",
  });

  const [customResult, setCustomResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async ({ battery_temp, ambient_temp, device_state }) => {
    const response = await fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ battery_temp, ambient_temp, device_state }),
    });

    console.log("Raw response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch advice from backend");
    }

    return await response.json();
  };

  const handleCustomAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCustomResult(null);

    try {
      const { deviceTemp, ambientTemp, usage } = customAnalysis;

      const data = await fetchAdvice({
        battery_temp: parseFloat(deviceTemp),
        ambient_temp: parseFloat(ambientTemp),
        device_state: usage,
      });

      const cleanedTip = (data.natural_language_tip || "")
        .replace(/\\n/g, "\n")
        .replace(/\\u[\dA-F]{4}/gi, "")
        .trim();

      setCustomResult({
        riskLevel: data.alert_level || "unknown",
        recommendation: cleanedTip || "⚠️ No specific advice provided.",
        actionItems: data.optional_action
          ? Array.isArray(data.optional_action)
            ? data.optional_action
            : [data.optional_action]
          : ["No immediate action recommended"],
        impact: `Predicted health impact: ${
          typeof data.predicted_health_impact === "number"
            ? data.predicted_health_impact.toFixed(2)
            : "N/A"
        }`,
      });
    } catch (error) {
      console.error("Custom analysis error:", error);
      setCustomResult({
        riskLevel: "error",
        recommendation: "⚠️ Unable to generate advice at the moment.",
        actionItems: ["N/A"],
        impact: "N/A",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div>
      <div className="advisory-header">
        <h1>AI-Powered Battery Advisory</h1>
        <p className="advisory-subtitle">
          Get personalized recommendations based on real-time data
        </p>
      </div>

      <div className="advisory-content">
        <div className="current-analysis card">
          <h3>Current System Analysis</h3>
          <div className="analysis-result">
            <div className={`risk-level ${healthData.alertLevel}`}>
              Risk Level: {healthData.alertLevel.toUpperCase()}
            </div>
            <div className="analysis-text">
              Current health score: {healthData.healthScore}%<br />
              System Status:{" "}
              {healthData.alertLevel === "danger"
                ? "Immediate attention required"
                : healthData.alertLevel === "warning"
                ? "Monitor closely"
                : "Operating normally"}
            </div>
            <div className="recommendations">
              <strong>Real-time Recommendations:</strong>
              <ul>
                {healthData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="custom-analysis card">
          <h3>Custom Scenario Analysis</h3>
          <form onSubmit={handleCustomAnalysis}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Device Temperature (°C)</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.1"
                  min="20"
                  max="60"
                  value={customAnalysis.deviceTemp}
                  onChange={(e) =>
                    setCustomAnalysis((prev) => ({
                      ...prev,
                      deviceTemp: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ambient Temperature (°C)</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.1"
                  min="5"
                  max="50"
                  value={customAnalysis.ambientTemp}
                  onChange={(e) =>
                    setCustomAnalysis((prev) => ({
                      ...prev,
                      ambientTemp: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Battery Level (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="100"
                  value={customAnalysis.batteryLevel}
                  onChange={(e) =>
                    setCustomAnalysis((prev) => ({
                      ...prev,
                      batteryLevel: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Usage Scenario</label>
                <select
                  className="form-control"
                  value={customAnalysis.usage}
                  onChange={(e) =>
                    setCustomAnalysis((prev) => ({
                      ...prev,
                      usage: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select scenario...</option>
                  <option value="idle">Idle</option>
                  <option value="discharging">Discharging</option>
                  <option value="charging">Charging</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full-width">
              {loading ? "Analyzing..." : "🤖 Analyze Scenario"}
            </button>
          </form>

          {customResult && (
            <div className="custom-result">
              <div className="result-header">
                <h4>Analysis Result</h4>
                <div className={`risk-badge ${customResult.riskLevel}`}>
                  {customResult.riskLevel.toUpperCase()}
                </div>
              </div>
              <div className="result-content">
                <div className="recommendation">
                  {customResult.recommendation.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
                <div className="action-items">
                  <strong>Action Items:</strong>
                  <ul>
                    {customResult.actionItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="impact-forecast">{customResult.impact}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAdvisory;
