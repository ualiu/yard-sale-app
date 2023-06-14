// Load Mapbox Directions API Plugin
mapboxgl.accessToken = 'pk.eyJ1IjoidWFsaXUiLCJhIjoiY2xpczg4MXAxMWZzYTNmbXJqcXVjNnRpcCJ9.zsXLm4vVZDQ9w3NRS4bDsw';

let map, directions;

// Function to provide directions
function provideDirections(destination) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      directions.setOrigin([position.coords.longitude, position.coords.latitude]);
      directions.setDestination(destination);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Fetch yard sales from API
async function getAllYardSales() {
  try {
    const res = await fetch('/api/post/displayPostOnMap');
    if (!res.ok) { // Check if response went through
      console.log('API response Error: ', res);
      return;
    }
    const data = await res.json();
    if (!data.data) { // Check if data is not empty
      console.log('Data Error: ', data);
      return;
    }
    // Continue your processing
    const yardSales = data.data.map(yardSale => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            yardSale.location.coordinates[0],
            yardSale.location.coordinates[1]
          ]
        },
        properties: {
          title: yardSale.title,
          description: yardSale.description,
          formattedAddress: yardSale.location.formattedAddress,
          date: yardSale.date,
          time: yardSale.time,
          userID: yardSale.userID.userName,
          icon: 'shop'
        }
      };
    });
    loadMap(yardSales);
  } catch (error) {
    console.log('Fetch Error: ', error);
  }
}


function loadMap(yardSales) {
  map.on('load', function() {
    // Ensure the sprite is loaded before adding the layer
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', function(error, image) {
      if (error) throw error;
      if (!map.hasImage('custom-marker')) map.addImage('custom-marker', image);

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: yardSales
          }
        },
        layout: {
          'icon-image': 'custom-marker',
          'icon-size': 0.05,
          'text-field': '{title}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        }
      });
    });

    map.on('click', 'points', function (e) {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { title, description, time, formattedAddress, date, userID } = e.features[0].properties;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <p class="lead">${title}</p>
          <p><b>What's happening:</b> ${description}</p>
          <p><b>Where's the address:</b> ${formattedAddress}</p>
          <p><b>When:</b> ${new Date(date).toLocaleDateString()}</p>
          <p><b>Time:</b> ${time}</p>
          <p><b>Who's organizing:</b> ${userID}</p>
          <p class="text-primary">to enable Directions allow the app to access your location, please!</p>
          <button class="btn btn-outline-success btn-lg" onclick="provideDirections([${coordinates[0]}, ${coordinates[1]}])">Get Directions</button>
        `)
        .addTo(map);
    });
  });
}

window.onload = function() {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 12,
    center: [-80.49282, 43.45117]
  });

  directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });

  map.addControl(directions, 'top-left');

  getAllYardSales();
}
