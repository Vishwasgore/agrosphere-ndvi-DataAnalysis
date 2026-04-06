# AgroSphere AI - Frontend

Beautiful web interface for satellite-based vegetation health analysis.

## Features

✨ **Interactive Map** - Click anywhere to select location  
📍 **Manual Coordinates** - Or enter coordinates directly  
🛰️ **Real-time Analysis** - Fetches Sentinel-2 satellite data  
📊 **Visual Results** - Beautiful NDVI maps and statistics  
📚 **Educational** - Explains NDVI and how it works  

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements_frontend.txt
```

### 2. Start the Backend Server

```bash
python backend.py
```

### 3. Open Your Browser

Navigate to: **http://localhost:5000**

## How to Use

1. **Select Location**
   - Click on the map to select a location
   - OR enter latitude/longitude manually
   - Adjust area size (default: 10 km)

2. **Analyze**
   - Click "🛰️ Analyze Vegetation" button
   - Wait 10-30 seconds for satellite data processing

3. **View Results**
   - See the NDVI vegetation health map
   - Review statistics (mean NDVI, coverage, health status)
   - Read the explanation of how NDVI works

## What You'll See

### Statistics Displayed:
- **Mean NDVI** - Average vegetation health (-1 to 1)
- **Vegetation Coverage** - Percentage of area with vegetation
- **Healthy Vegetation** - Percentage with NDVI > 0.6
- **Stressed Vegetation** - Percentage with NDVI 0.2-0.6

### NDVI Map Colors:
- 🔴 **Red** - Low NDVI (bare soil, stressed crops)
- 🟡 **Yellow** - Moderate NDVI (developing vegetation)
- 🟢 **Green** - High NDVI (healthy, dense vegetation)

## Example Locations to Try

### Agricultural Areas:
- **Punjab, India**: 30.9010, 75.8573
- **Iowa, USA**: 42.0308, -93.6319
- **Pampas, Argentina**: -34.6037, -58.3816

### Urban vs Rural:
- **Mumbai, India**: 19.0760, 72.8777
- **Delhi, India**: 28.6139, 77.2090

### Forests:
- **Amazon**: -3.4653, -62.2159
- **Congo Basin**: -0.7893, 23.6561

## Troubleshooting

**Port already in use?**
```bash
# Change port in backend.py line: app.run(port=5001)
```

**CORS errors?**
- Make sure flask-cors is installed
- Backend must be running on localhost:5000

**No satellite data?**
- Try increasing DAYS_BACK in test_sentinel_ndvi.py
- Some areas may have cloud cover
- Check your Sentinel Hub credentials

## Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Flask Backend (backend.py)
    ↓
NDVI Analysis Script (test_sentinel_ndvi.py)
    ↓
Sentinel Hub API
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Leaflet.js
- **Backend**: Flask, Python
- **Data**: Sentinel-2 L2A satellite imagery
- **Analysis**: NumPy, Rasterio, Matplotlib

---

**Made with 🌱 by AgroSphere AI**
