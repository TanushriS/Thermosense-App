import pandas as pd
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
import joblib
import requests
import os

from train_model import train_and_save
from gpt2_advice import get_advice_from_gpt2


app = FastAPI(title="ThermoSense ML + GPT-2 Advisory")

MODEL_PATH = "model.pkl"
ENCODER_PATH = "encoder.pkl"
COLUMN_PATH = "columns.pkl"

# Check if model, encoder, and column list exist
if not (os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH) and os.path.exists(COLUMN_PATH)):
    print("Model, encoder, or column file not found. Training...")
    train_and_save()

# Load model and encoder
model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
print("Model and encoder loaded.")


# ========== FastAPI Input Schema ==========
class SensorInput(BaseModel):
    battery_temp: float
    ambient_temp: float
    device_state: str


def get_alert_level(impact):
    if impact > 0.07:
        return "danger"
    elif impact > 0.04:
        return "warning"
    else:
        return "safe"


# ========== API Endpoints ==========
@app.get("/")
def home():
    return {"message": "Welcome to ThermoSense Advisory API. Use POST /api/advice to get predictions."}


@app.post("/api/advice")
def get_advice(input: SensorInput):
    try:
        columns = joblib.load(COLUMN_PATH)

        input_df = pd.DataFrame([input.dict()])
        encoded_state = encoder.transform(input_df[["device_state"]])
        encoded_df = pd.DataFrame(encoded_state, columns=encoder.get_feature_names_out(["device_state"]))
        X_live = pd.concat([input_df[["battery_temp", "ambient_temp"]].reset_index(drop=True), encoded_df], axis=1)
        X_live = X_live.reindex(columns=columns, fill_value=0)

        impact = model.predict(X_live)[0]
        alert = get_alert_level(impact)
        advice = get_advice_from_gpt2(
            battery_temp=input.battery_temp, ambient_temp=input.ambient_temp, device_state=input.device_state
        )

        action = None
        if alert == "danger":
            action = "Stop using device immediately and allow cooling"
        elif alert == "warning":
            action = "Monitor temperature and reduce intensive tasks"

        return {
            "predicted_health_impact": round(float(impact), 5),
            "alert_level": alert,
            "natural_language_tip": advice,
            "optional_action": action,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
