import { envs } from "src/config/envs";
import { FoundPet } from "../interfaces/found-pet.interface";
import { LostPet } from "../interfaces/lost-pet.interface";

export const generateMapboxImage = (
  foundPet: FoundPet,
  lostPet: LostPet
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 600;   // mejor para emails
  const height = 300;  // mejor para emails

  const lostPin = `pin-s-l+ff0000(${lostPet.location.coordinates[0]},${lostPet.location.coordinates[1]})`;
  const foundPin = `pin-s-l+0000ff(${foundPet.location.coordinates[0]},${foundPet.location.coordinates[1]})`;

  const centerLon = ((lostPet.location.coordinates[0] + foundPet.location.coordinates[0]) / 2).toFixed(6);
  const centerLat = ((lostPet.location.coordinates[1] + foundPet.location.coordinates[1]) / 2).toFixed(6);

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/${centerLon},${centerLat},14/600x300?access_token=${envs.MAPBOX_TOKEN}`;

console.log("Map URL:", mapUrl);

  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${accessToken}`;
};