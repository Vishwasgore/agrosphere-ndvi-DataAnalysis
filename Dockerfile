FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for GDAL/rasterio
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY sample_output/ ./sample_output/

# Expose port
EXPOSE 7860

# Run the application
CMD ["gunicorn", "--chdir", "backend", "--bind", "0.0.0.0:7860", "app:app"]
