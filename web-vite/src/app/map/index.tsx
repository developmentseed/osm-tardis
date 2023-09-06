import { useEffect, useRef } from "preact/hooks";
import MapLibreGL from "maplibre-gl";
import { AppActionTypes, AppState } from "../reducer";

interface MapProps {
  appState: AppState;
  dispatchAppState: any;
}

const MAP_OPTIONS = {
  center: [-74.5087291, 40.28],
  zoom: 14,
} as {
  center: [number, number];
  zoom: number;
};

export function Map(props: MapProps) {
  const { appState, dispatchAppState } = props;

  useEffect(() => {
    // When the map is already initialized, do a first view update
    if (appState && appState.map) {
      dispatchAppState({
        type: AppActionTypes.UPDATE_VIEW,
      });
      return;
    }

    const map = new MapLibreGL.Map({
      container: "map",
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "raster",
            tileSize: 256,
            tiles: [
              `https://api.mapbox.com/styles/v1/ingalls/ckvh0wwm8g2cw15r05ozt0ybr/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbG03b3NudWEwMnlmM2RzMjlhdjNrZzFmIn0.DKX63r8pJPPTqSxrV_y58Q`,
            ],
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "rgb(4,7,14)",
            },
          },
          {
            id: "basemap",
            type: "raster",
            source: "basemap",
            minzoom: 0,
            maxzoom: 15,
          },
        ],
      },
      center: MAP_OPTIONS.center,
      zoom: MAP_OPTIONS.zoom,
      maxZoom: 18,
      minZoom: 0,
    });

    map.on("load", () => {
      map.addSource("data", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "data-point",
        type: "circle",
        source: "data",
        paint: {
          "circle-radius": 6,
          "circle-color": "#B42222",
        },
        filter: ["==", "$type", "Point"],
      });
      map.addLayer({
        id: "data-fill",
        type: "fill",
        source: "data",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#FEB24C",
        },
      });
      map.addLayer({
        id: "data-line",
        type: "line",
        source: "data",
        filter: ["==", "$type", "LineString"],
        paint: {
          "line-color": "#800026",
          "line-opacity": 0.8,
          "line-width": 2,
        },
      });

      map.addSource("rectangle", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "rectangle",
        type: "line",
        source: "rectangle",
        paint: {
          "line-color": "#0000FF",
          "line-opacity": 0.9,
          "line-width": 3,
        },
      });

      map.on("moveend", () => {
        dispatchAppState({
          type: AppActionTypes.UPDATE_VIEW,
        });
      });

      dispatchAppState({
        type: AppActionTypes.SET_MAP_REF,
        data: { map },
      });
    });
  }, [appState?.map]);

  return <div id="map"></div>;
}
