import { envs } from "src/config/envs";

export const generateMapboxImage = (
  lostLon: number,
  lostLat: number,
  foundLon: number,
  foundLat: number
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 600;
  const height = 300;

  const lostPin = `pin-s-l+ff0000(${lostLon},${lostLat})`;
  const foundPin = `pin-s-l+0000ff(${foundLon},${foundLat})`;

  const centerLon = ((lostLon + foundLon) / 2).toFixed(6);
  const centerLat = ((lostLat + foundLat) / 2).toFixed(6);

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${accessToken}`;

  console.log("Map URL:", mapUrl);

  return mapUrl;
};