# 🚀 Quick Reference Card

## Start the Application

```bash
python backend.py
```

Then open: **http://localhost:5000**

---

## How to Use (3 Steps)

1. **Click on map** (or enter coordinates)
2. **Click "🛰️ Analyze Vegetation"**
3. **View results!**

---

## What You'll See

### Key Insights Section (NEW!)
```
From this region:

• Only X% of the land is healthy
• Y% of the crops are stressed
• Z% is non-vegetated

[Smart summary]

⚠️ This is extremely important.
```

---

## Understanding NDVI Values

| NDVI Range | Meaning |
|------------|---------|
| -1.0 to 0.2 | Bare soil, water, urban |
| 0.2 to 0.6 | Sparse/stressed vegetation |
| 0.6 to 1.0 | Healthy, dense vegetation |

---

## NDVI Map Colors

- 🔴 **Red**: Stressed/bare areas
- 🟡 **Yellow**: Moderate vegetation
- 🟢 **Green**: Healthy vegetation

---

## Example Locations

**Agricultural:**
- Punjab: 30.9010, 75.8573

**Urban:**
- Mumbai: 19.0760, 72.8777

**Forest:**
- Amazon: -3.4653, -62.2159

---

## Files You Need

- `backend.py` - Server
- `frontend/` - Web interface
- `test_sentinel_ndvi.py` - Analysis script
- `coordinates.py` - Config

---

## Troubleshooting

**Server won't start?**
```bash
python -m pip install flask flask-cors
```

**Can't access?**
- Try http://127.0.0.1:5000
- Check if server is running

---

## Key Features

✅ Interactive world map  
✅ Real-time satellite analysis  
✅ Color-coded NDVI maps  
✅ **Plain language insights** (NEW!)  
✅ Educational explanations  

---

**Access now: http://localhost:5000** 🌱
