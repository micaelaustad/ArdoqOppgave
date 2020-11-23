import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { getData, generatePopUp } from './functions';
import { useInterval } from './useInterval'
const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};

const Application = () => {
  const [map, setMap] = useState(null)
  const [lng, setLng] = useState(null)
  const [lat, setLat] = useState(null)
  const [zoom, setZoom] = useState(null)
  const [geoJSON, setGeoJSON] = useState(null)
  const mapContainer = useRef(null)

  function percentageToHsl(percentage, hue0, hue1) {
    var hue = (percentage * (hue1 - hue0)) + hue0;
    return 'hsl(' + hue + ', 100%, 50%)';
  }

  const addPointer = () => {
    if (geoJSON) {
      geoJSON.features.forEach(function (marker) {

        const perc = marker.properties.availableBikes / marker.properties.capacity
        const color = marker.properties.availableBikes == 0 ? "hsl(0,0%,54%)" : percentageToHsl(perc, 0, 120);
        var element = document.createElement('p');
        element.innerHTML = marker.properties.availableBikes;
        element.className = 'marker';
        element.style.backgroundColor = color;
        new mapboxgl.Marker({ element, color })
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(generatePopUp(marker)))
          .addTo(map);
      })

    }
  }

  useEffect(() => {
    (async () => {
      setGeoJSON(await getData());
      addPointer()
    })()
  }, []);


  useInterval(() => {
    (async () => {
      setGeoJSON(await getData());
      addPointer()
    })()

  }, 10000);



  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZW11bGJlcmciLCJhIjoiY2tnZGdkMzN5MGVjcTJ5czEyZXEwYmI3ZiJ9.gvMbksa-oA_-qJtCJQf9rw';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [10.7225, 59.9165],
        zoom: 11.65
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4))
        setLat(map.getCenter().lat.toFixed(4))
        setZoom(map.getZoom().toFixed(2))
      });

    };
    if (!map) initializeMap({ setMap, mapContainer });
    addPointer()

  }, [map]);


  return (<div>
    <div className='sidebarStyle'>
      {map ? <div>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div> : null}
    </div>
    <div ref={el => (mapContainer.current = el)} style={styles} />;

  </div>)
}


ReactDOM.render(<Application />, document.getElementById('app'));       