import { WebView } from 'react-native-webview';

import type { RoutePoint } from '@/types/activity';

type Props = {
  currentPosition: RoutePoint | null;
  route: RoutePoint[];
  primaryColor: string;
};

export default function ActivityMap({
  currentPosition,
  route,
  primaryColor,
}: Props) {
  const latitude =
    currentPosition?.latitude ??
    route[0]?.latitude ??
    -34.6037;

  const longitude =
    currentPosition?.longitude ??
    route[0]?.longitude ??
    -58.3816;

  const routeCoordinates = route.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        ></script>

        <script>
          const map = L.map('map', {
            zoomControl: true
          }).setView(
            [${latitude}, ${longitude}],
            16
          );

          L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap'
            }
          ).addTo(map);

          const route = ${JSON.stringify(routeCoordinates)};

          if (route.length > 1) {
            const polyline = L.polyline(
              route,
              {
                color: '${primaryColor}',
                weight: 5
              }
            ).addTo(map);

            map.fitBounds(polyline.getBounds(), {
              padding: [30, 30]
            });
          }

          if (route.length > 0) {
            L.marker(route[0])
              .addTo(map)
              .bindPopup('Inicio');
          }

          ${
            currentPosition
              ? `
          const currentMarker = L.circleMarker(
            [${currentPosition.latitude}, ${currentPosition.longitude}],
            {
              radius: 9,
              color: '${primaryColor}',
              fillColor: '${primaryColor}',
              fillOpacity: 1
            }
          ).addTo(map);
          `
              : ''
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      javaScriptEnabled
      domStorageEnabled
      style={{ flex: 1 }}
    />
  );
}