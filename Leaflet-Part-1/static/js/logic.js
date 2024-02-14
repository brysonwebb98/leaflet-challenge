document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([0, 0], 2);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  
    function getMarkerSize(magnitude) {
      return magnitude * 5;
    }
  
    function getMarkerColor(depth) {
      if (depth < 10) {
        return 'lightgreen';
      } else if (depth < 30) {
        return 'green';
      } else if (depth < 50) {
        return 'yellow';
      } else if (depth < 70) {
        return 'orange';
      } else {
        return 'red';
      }
    }
  
    d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(function (data) {
      data.features.forEach(function (feature) {
        var coords = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = coords[2];
        var location = feature.properties.place;
  
        var markerSize = getMarkerSize(magnitude);
        var markerColor = getMarkerColor(depth);
  
        var marker = L.circleMarker([coords[1], coords[0]], {
          radius: markerSize,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.7
        }).bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${location}<br><b>Depth:</b> ${depth} km`);
  
        marker.addTo(map);
      });
    }).catch(function (error) {
      console.error('Error fetching earthquake data:', error);
    });
  
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var depths = [0, 10, 30, 50, 70];
      var labels = ['<strong>Depth</strong>'];
      depths.forEach(function (depth, index) {
        labels.push(
          '<i style="background:' + getMarkerColor(depth + 1) + '"></i> ' +
          (index === depths.length - 1 ? '>' : '') + depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + ' km<br>' : '+ km')
        );
      });
      div.innerHTML = labels.join('');
      return div;
    };
    legend.addTo(map);
  });