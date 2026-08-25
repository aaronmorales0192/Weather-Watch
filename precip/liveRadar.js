// Live animated radar using Leaflet.js + Iowa Environmental Mesonet's (IEM)
// free public NEXRAD composite reflectivity tile service. No API key needed.
// Docs: https://mesonet.agron.iastate.edu/ogc/
//
// Note: this shows precipitation INTENSITY (how heavy it's falling),
// using the standard green -> yellow -> orange -> red reflectivity scale
// most people recognize from TV/NWS radar. It does NOT show precipitation
// TYPE (rain vs. snow vs. mix) the way the color legend earlier on this
// page describes — that's a different, more specialized NWS data product.

document.addEventListener('DOMContentLoaded', function () {
  const mapEl = document.getElementById('radar-map');
  const playBtn = document.getElementById('radar-play-btn');
  const timestampEl = document.getElementById('radar-timestamp');

  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map(mapEl, {
    center: [38.9, -77.2],
    zoom: 6,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors, Radar: Iowa Environmental Mesonet',
    maxZoom: 10
  }).addTo(map);

  // IEM offers the last 50 minutes of composite reflectivity in 5-minute
  // steps. "900913" (no suffix) is the latest available frame.
  const IEM_OFFSETS = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0];

  const radarLayers = IEM_OFFSETS.map(function (offsetMinutes) {
    const suffix = offsetMinutes === 0 ? '900913' : '900913-m' + String(offsetMinutes).padStart(2, '0') + 'm';
    const tileLayer = L.tileLayer(
      'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-' + suffix + '/{z}/{x}/{y}.png',
      { opacity: 0, maxZoom: 10 }
    );
    return { tileLayer: tileLayer, offsetMinutes: offsetMinutes };
  });

  let currentFrame = radarLayers.length - 1;
  let isPlaying = true;
  let animationTimer = null;

  function formatTimestamp(offsetMinutes) {
    const approxTime = new Date(Date.now() - offsetMinutes * 60000);
    const timeStr = approxTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return offsetMinutes === 0 ? 'Latest — ' + timeStr + ' local' : '~' + timeStr + ' local';
  }

  function showFrame(index) {
    radarLayers.forEach(function (layer, i) {
      if (i === index) {
        if (!map.hasLayer(layer.tileLayer)) {
          layer.tileLayer.addTo(map);
        }
        layer.tileLayer.setOpacity(0.7);
      } else {
        layer.tileLayer.setOpacity(0);
      }
    });

    timestampEl.textContent = formatTimestamp(radarLayers[index].offsetMinutes);
  }

  function playAnimation() {
    animationTimer = setInterval(function () {
      currentFrame = (currentFrame + 1) % radarLayers.length;
      showFrame(currentFrame);
    }, 600);
  }

  function stopAnimation() {
    clearInterval(animationTimer);
  }

  playBtn.addEventListener('click', function () {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? 'Pause' : 'Play';

    if (isPlaying) {
      playAnimation();
    } else {
      stopAnimation();
    }
  });

  showFrame(currentFrame);
  playAnimation();
});