// Looks up the National Weather Service forecast office for a US city/state
// Step 1: geocode the city/state into lat/lon using OpenStreetMap Nominatim (free, no API key)
// Step 2: feed those coordinates into the NWS API's /points endpoint to get the office identifier
//
// To show a "Visit Office Website" link in the result, add
// data-show-office-link="true" to the <form id="nws-lookup-form"> element.
// Omit that attribute (or set it to "false") to show plain text only.

const nwsForm = document.getElementById('nws-lookup-form');
const nwsResult = document.getElementById('nws-lookup-result');

if (nwsForm) {
  const showOfficeLink = nwsForm.dataset.showOfficeLink === 'true';

  nwsForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const city = document.getElementById('nws-city').value.trim();
    const state = document.getElementById('nws-state').value.trim();

    if (!city || !state) {
      nwsResult.textContent = 'Please enter both a city and a state.';
      nwsResult.className = 'nws-lookup-result error';
      return;
    }

    nwsResult.textContent = 'Looking up your station...';
    nwsResult.className = 'nws-lookup-result loading';

    try {
      // Step 1: Geocode city/state to latitude/longitude
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&country=USA&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=1`;
      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
        throw new Error('Location lookup failed.');
      }

      const geoData = await geoResponse.json();

      if (!geoData.length) {
        nwsResult.textContent = `Couldn't find "${city}, ${state}". Check the spelling and try again.`;
        nwsResult.className = 'nws-lookup-result error';
        return;
      }

      const { lat, lon } = geoData[0];

      // Step 2: Use the coordinates to look up the NWS forecast office
      const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
      const pointsResponse = await fetch(pointsUrl);

      if (!pointsResponse.ok) {
        throw new Error('NWS lookup failed.');
      }

      const pointsData = await pointsResponse.json();
      const gridId = pointsData.properties.gridId;
      const stationCode = 'K' + gridId;

      if (showOfficeLink) {
        const officeUrl = `https://www.weather.gov/${gridId.toLowerCase()}/`;
        nwsResult.innerHTML = `
          Your local NWS forecast office is <strong>${stationCode}</strong>.
          <a href="${officeUrl}" target="_blank" rel="noopener" class="nws-office-link">
            Visit ${stationCode} Office Website
          </a>
        `;
      } else {
        nwsResult.innerHTML = `Your local NWS forecast office is <strong>${stationCode}</strong>.`;
      }

      nwsResult.className = 'nws-lookup-result success';

    } catch (error) {
      nwsResult.textContent = 'Something went wrong looking up that location. Please try again.';
      nwsResult.className = 'nws-lookup-result error';
    }
  });
}