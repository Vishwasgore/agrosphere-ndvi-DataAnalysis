"""
AgroSphere NDVI - Flask Backend
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os, sys, importlib, traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ndvi_service
import coordinates

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

@app.route('/')
def index():
    return send_file(os.path.join(FRONTEND_DIR, 'index.html'))

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data    = request.json
        lat     = data.get('lat')
        lon     = data.get('lon')
        area_km = data.get('area_km', 10.0)

        if lat is None or lon is None:
            return jsonify({'error': 'Missing latitude or longitude'}), 400

        coordinates.CENTER_LAT   = lat
        coordinates.CENTER_LON   = lon
        coordinates.AREA_SIZE_KM = area_km
        importlib.reload(coordinates)
        importlib.reload(ndvi_service)

        print(f"\n[BACKEND] Analyzing ({lat}, {lon}), area: {area_km} km")

        token      = ndvi_service.get_access_token()
        bbox       = ndvi_service.generate_bbox_from_center(lat, lon, area_km)
        tiff_bytes = ndvi_service.fetch_satellite_data(token, bbox)
        red, nir   = ndvi_service.extract_bands(tiff_bytes)
        ndvi       = ndvi_service.compute_ndvi(red, nir)
        ndvi_service.save_outputs(tiff_bytes, red, nir, ndvi)

        result = ndvi_service.generate_json_output(ndvi, lat, lon, area_km)
        result['ndvi_map_url'] = '/ndvi_map.png'
        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/ndvi_map.png')
def get_ndvi_map():
    path = os.path.join(BASE_DIR, 'ndvi_map.png')
    if os.path.exists(path):
        return send_file(path, mimetype='image/png')
    return jsonify({'error': 'NDVI map not found'}), 404

if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
