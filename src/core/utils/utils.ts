import { envs } from "src/config/envs";
export const generateMapboxImage = (
  lostLat: number,
  lostLon: number,
  foundLat: number,
  foundLon: number
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 800;
  const height = 400;

  const lostPin = `pin-s-l+ff0000(${lostLon},${lostLat})`;
  const foundPin = `pin-s-l+0000ff(${foundLon},${foundLat})`;

  const centerLon = (lostLon + foundLon) / 2;
  const centerLat = (lostLat + foundLat) / 2;

  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${accessToken}`;
};