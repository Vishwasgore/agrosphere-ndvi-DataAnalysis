# 🚀 Quick Start Guide

## Start the Application

### Option 1: Double-click (Windows)
```
Double-click: start_frontend.bat
```

### Option 2: Command Line
```bash
python backend.py
```

## Access the Application

Open your browser and go to:
```
http://localhost:5000
```

## How to Use

### 1️⃣ Select Location
- **Click on the map** to select any location worldwide
- OR **Enter coordinates manually** in the input fields
- Adjust the **area size** (default: 10 km)

### 2️⃣ Analyze
- Click the **"🛰️ Analyze Vegetation"** button
- Wait 10-30 seconds while we fetch satellite data

### 3️⃣ View Results
You'll see:
- 🗺️ **NDVI Map** - Color-coded vegetation health
- 📊 **Statistics** - Mean NDVI, coverage percentages
- 📍 **Location Details** - Coordinates, area, timestamp
- 📚 **Explanation** - What NDVI is and how it works

## Understanding the Results

### NDVI Values
- **-1.0 to 0.2**: Water, bare soil, urban areas
- **0.2 to 0.6**: Sparse or stressed vegetation
- **0.6 to 1.0**: Healthy, dense vegetation

### Map Colors
- 🔴 **Red**: Low NDVI (stressed/bare)
- 🟡 **Yellow**: Moderate NDVI
- 🟢 **Green**: High NDVI (healthy)

## Example Locations

Try these interesting locations:

**Agricultural Areas:**
- Punjab, India: `30.9010, 75.8573`
- Iowa, USA: `42.0308, -93.6319`

**Urban Areas:**
- Mumbai: `19.0760, 72.8777`
- Delhi: `28.6139, 77.2090`

**Forests:**
- Amazon: `-3.4653, -62.2159`

## Troubleshooting

**Server won't start?**
- Make sure Python is installed
- Install dependencies: `pip install flask flask-cors`

**No results?**
- Check your internet connection
- Verify Sentinel Hub credentials in `test_sentinel_ndvi.py`
- Try a different location or increase area size

**Port 5000 already in use?**
- Edit `backend.py` and change the port number

---

**Need Help?** Check `FRONTEND_README.md` for detailed documentation.
