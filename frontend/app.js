// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// Marker for selected location
let marker = null;

// Handle map clicks
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    
    // Update input fields
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lon').value = lon.toFixed(6);
    
    // Update or create marker
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
});

// Handle analyze button click
document.getElementById('analyzeBtn').addEventListener('click', async function() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    const area = parseFloat(document.getElementById('area').value);
    
    // Validate inputs
    if (isNaN(lat) || isNaN(lon) || isNaN(area)) {
        alert('Please enter valid coordinates and area size');
        return;
    }
    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        alert('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180');
        return;
    }
    
    // Show loading state
    const btn = this;
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    btn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block';
    
    try {
        // Call backend API
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lon, area_km: area })
        });
        
        if (!response.ok) {
            throw new Error('Analysis failed. Please try again.');
        }
        
        const data = await response.json();
        
        // Display results
        displayResults(data);
        
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        // Reset button state
        btn.disabled = false;
        btnText.style.display = 'inline';
        loader.style.display = 'none';
    }
});

function displayResults(data) {
    // Hide welcome screen, show results
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
    // Update NDVI map
    document.getElementById('ndviMap').src = data.ndvi_map_url + '?t=' + new Date().getTime();
    
    // Update statistics
    document.getElementById('meanNdvi').textContent = data.mean_ndvi.toFixed(4);
    document.getElementById('vegCoverage').textContent = data.vegetation_coverage_percentage.toFixed(1) + '%';
    document.getElementById('healthyPct').textContent = data.healthy_percentage.toFixed(1) + '%';
    document.getElementById('stressedPct').textContent = data.stressed_percentage.toFixed(1) + '%';
    
    // Update key insights
    document.getElementById('insightHealthy').textContent = 
        `Only ${data.healthy_percentage.toFixed(1)}% of the land is healthy`;
    document.getElementById('insightStressed').textContent = 
        `${data.stressed_percentage.toFixed(1)}% of the crops are stressed`;
    document.getElementById('insightNonVeg').textContent = 
        `${data.non_vegetated_percentage.toFixed(1)}% is non-vegetated`;
    
    // Generate summary based on data
    const vegCoverage = data.vegetation_coverage_percentage.toFixed(1);
    const stressedPct = data.stressed_percentage.toFixed(1);
    
    let summary = '';
    if (data.vegetation_coverage_percentage > 50) {
        summary = `So although ${vegCoverage}% land has crops, most of those crops are under stress.`;
    } else {
        summary = `Only ${vegCoverage}% of the land has vegetation, and most of it is stressed.`;
    }
    
    document.getElementById('insightSummary').textContent = summary;
    
    // Generate market prediction
    generateMarketPrediction(data);
    
    // Update location details
    document.getElementById('coordinates').textContent = 
        `${data.location.lat.toFixed(6)}, ${data.location.lon.toFixed(6)}`;
    document.getElementById('areaInfo').textContent = 
        `${data.location.area_km} km × ${data.location.area_km} km`;
    
    // Format timestamp
    const timestamp = new Date(data.timestamp);
    document.getElementById('timestamp').textContent = timestamp.toLocaleString();
    
    // Scroll to results
    document.getElementById('resultsScreen').scrollIntoView({ behavior: 'smooth' });
}

function generateMarketPrediction(data) {
    const meanNdvi = data.mean_ndvi;
    const stressedPct = data.stressed_percentage;
    const healthyPct = data.healthy_percentage;
    
    // Determine production level
    let productionLevel = '';
    let yieldCategory = '';
    
    if (meanNdvi > 0.6) {
        productionLevel = 'HIGH';
        yieldCategory = 'Healthy, strong yield';
    } else if (meanNdvi >= 0.3) {
        productionLevel = 'MODERATE';
        yieldCategory = 'Moderate yield';
    } else {
        productionLevel = 'LOW';
        yieldCategory = 'Yield loss expected';
    }
    
    // Step 1: Production Analysis
    document.getElementById('ndviAnalysis').textContent = 
        `Mean NDVI = ${meanNdvi.toFixed(2)} → ${meanNdvi < 0.3 ? 'Below 0.3' : meanNdvi < 0.6 ? 'Between 0.3-0.6' : 'Above 0.6'}`;
    document.getElementById('stressAnalysis').textContent = 
        `${stressedPct.toFixed(1)}% crops are stressed`;
    document.getElementById('productionConclusion').textContent = 
        `Total production in this region will be ${productionLevel}.`;
    
    // Step 2: Supply Impact
    if (productionLevel === 'LOW') {
        document.getElementById('supplyInference').textContent = 
            'There will be less crop available in mandis in the coming weeks.';
    } else if (productionLevel === 'MODERATE') {
        document.getElementById('supplyInference').textContent = 
            'Supply will be moderate, with some shortages possible.';
    } else {
        document.getElementById('supplyInference').textContent = 
            'Supply will be adequate to meet market demand.';
    }
    
    // Step 3: Price Impact
    if (productionLevel === 'LOW') {
        document.getElementById('pricePrediction').textContent = 
            'Market prices are likely to rise in the next 1–2 months.';
    } else if (productionLevel === 'MODERATE') {
        document.getElementById('pricePrediction').textContent = 
            'Prices may see moderate increase due to supply constraints.';
    } else {
        document.getElementById('pricePrediction').textContent = 
            'Prices are expected to remain stable.';
    }
    
    // Step 4: Final Recommendation
    document.getElementById('reason1').textContent = 
        `Crops are ${stressedPct > 70 ? 'heavily' : stressedPct > 40 ? 'moderately' : 'slightly'} stressed regionally`;
    
    if (productionLevel === 'LOW') {
        document.getElementById('reason2').textContent = 'Supply will drop';
        document.getElementById('reason3').textContent = 'Prices will rise';
        document.getElementById('recommendation').textContent = 'DO NOT SELL NOW — WAIT for the price peak';
        document.getElementById('currentAction').textContent = 'HOLD';
        document.getElementById('futureAction').textContent = 'SELL later at higher price';
    } else if (productionLevel === 'MODERATE') {
        document.getElementById('reason2').textContent = 'Supply will be moderate';
        document.getElementById('reason3').textContent = 'Prices may increase slightly';
        document.getElementById('recommendation').textContent = 'MONITOR prices — Consider selling if prices rise';
        document.getElementById('currentAction').textContent = 'MONITOR';
        document.getElementById('futureAction').textContent = 'SELL when favorable';
    } else {
        document.getElementById('reason2').textContent = 'Supply will be adequate';
        document.getElementById('reason3').textContent = 'Prices will remain stable';
        document.getElementById('recommendation').textContent = 'SELL NOW at current market rates';
        document.getElementById('currentAction').textContent = 'SELL';
        document.getElementById('futureAction').textContent = 'No need to wait';
    }
    
    // One-line summary
    let summaryText = '';
    if (meanNdvi < 0.3 && stressedPct > 80) {
        summaryText = `Because average NDVI is below 0.3 and more than 80% of crops are stressed, our system predicts a supply shortage — so prices will rise and farmers should wait before selling.`;
    } else if (meanNdvi < 0.3) {
        summaryText = `With NDVI below 0.3, production will be low. Expect supply constraints and potential price increases in coming weeks.`;
    } else if (stressedPct > 80) {
        summaryText = `With over 80% crops stressed, expect reduced yields and potential supply shortages leading to price increases.`;
    } else if (meanNdvi >= 0.6 && healthyPct > 50) {
        summaryText = `Healthy crops with high NDVI indicate good production. Supply will be adequate and prices should remain stable.`;
    } else {
        summaryText = `Moderate crop health suggests average production. Monitor market conditions for optimal selling time.`;
    }
    
    document.getElementById('summaryBanner').textContent = summaryText;
}

// Allow manual coordinate entry to update marker
document.getElementById('lat').addEventListener('change', updateMarkerFromInputs);
document.getElementById('lon').addEventListener('change', updateMarkerFromInputs);

function updateMarkerFromInputs() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    
    if (!isNaN(lat) && !isNaN(lon)) {
        const latlng = L.latLng(lat, lon);
        
        if (marker) {
            marker.setLatLng(latlng);
        } else {
            marker = L.marker(latlng).addTo(map);
        }
        
        map.setView(latlng, 10);
    }
}
