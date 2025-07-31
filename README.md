# 🔋 ThermoSense – Battery Health Monitoring System (Docker)

![Dashboard Preview](https://github.com/TanushriS/assets/blob/main/dashboard.png)

A real-time battery health monitoring system with machine learning predictions and advisory generation, now containerized with Docker.

## 🚀 Features
- **ML-Powered Predictions** - Hugging Face integrated models
- **Smart Advisories** - GPT-2 generated recommendations
- **Real-time Dashboard** - Interactive charts and alerts
- **One-Click Deployment** - Fully dockerized setup
- **REST API** - FastAPI backend with clean endpoints

## 🛠️ Tech Stack
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | React, Chart.js                     |
| Backend         | FastAPI (Python 3.11)               |
| ML Models       | Hugging Face Transformers           |
| Infrastructure  | Docker, Docker Compose              |
| Visualization   | Chart.js, Custom CSS                |

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB RAM available

```bash
# Clone the repository
git clone https://github.com/your-repo/thermosense.git
cd thermosense

# Build and start containers
docker-compose up --build

# Access the application:
# - Frontend: http://localhost:80
# - Backend API: http://localhost:8000
```

## 📂 Project Structure
```thermosense/
├── backend/
│   ├── Dockerfile          # Python+FastAPI setup
│   ├── api.py              # ML endpoints
│   ├── model.py            # Prediction logic
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── Dockerfile          # Nginx+React setup
│   ├── app/                # React components
│   │   ├── app.js          # Main logic
│   │   └── style.css       # Styling
│   └── nginx.conf          # Nginx configuration
└── docker-compose.yml      # Service orchestration
```

---

## 🖼️ Screenshots

### 📊 Dashboard
![Live Dashboard](https://github.com/TanushriS/assets/blob/main/dashboard.png)

### 📈 Real-Time Chart
![Chart](https://github.com/TanushriS/assets/blob/main/chart%20views.png)

### 🚨 Alerts
![Alerts](https://github.com/TanushriS/assets/blob/main/alerts.png)

---

## 📬 API Endpoint Example

**POST** `/api/advice`

```json
{
  "battery_temp": 38.5,
  "ambient_temp": 32.2,
  "device_state": "charging"
}
```

**Response**
```json
{
  "predicted_health_impact": 0.07852,
  "alert_level": "danger",
  "natural_language_tip": "Critical: High battery stress detected.",
  "optional_action": "Stop using device immediately and allow cooling"
}
```
### ⚠️ Troubleshooting
---
## Common Issues:

```bash
# 1. Port conflicts
Error: Port 80 already in use
Solution: Change ports in docker-compose.yml

# 2. Model loading failures
Error: HF API token not found
Solution: Add token to backend/.env:
HF_TOKEN=your_huggingface_token

# 3. Insufficient memory
Error: Container killed due to OOM
Solution: Increase Docker memory to 4GB+
```
