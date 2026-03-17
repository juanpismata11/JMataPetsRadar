import { FoundPet } from "src/core/interfaces/found-pet.interface";
import { LostPet } from "src/core/interfaces/lost-pet.interface";

export const generateFoundPetEmailTemplate = (
  lostPet: LostPet,
  foundPet: FoundPet,
  mapUrl: string
): string => {
  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f0f2f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
          <tr>
              <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
                      <tr>
                          <td style="padding:32px 40px;">
                              <h1 style="margin:0 0 16px;">¡Se ha encontrado tu mascota!</h1>
                              <p style="margin:0 0 16px;">
                                  Se ha registrado una mascota encontrada cerca de la ubicación donde se perdió <strong>${lostPet.name}</strong>.
                              </p>

                              <h2>Datos de la mascota encontrada:</h2>
                              <ul>
                                  <li>Especie: ${foundPet.species}</li>
                                  <li>Raza: ${foundPet.breed || 'N/A'}</li>
                                  <li>Color: ${foundPet.color}</li>
                                  <li>Tamaño: ${foundPet.size}</li>
                                  <li>Descripción: ${foundPet.description}</li>
                              </ul>

                              <h2>Datos de contacto de quien la encontró:</h2>
                              <ul>
                                  <li>Nombre: ${foundPet.finder_name}</li>
                                  <li>Email: ${foundPet.finder_email}</li>
                                  <li>Teléfono: ${foundPet.finder_phone}</li>
                              </ul>

                              <h2>Ubicaciones:</h2>
                              <p>
                                  Mascota perdida: ${lostPet.address}<br/>
                                  Mascota encontrada: ${foundPet.address}
                              </p>

                              <img src="${mapUrl}" width="100%" style="border-radius:12px;" alt="Mapa de ubicación"/>

                              <p style="font-size:12px;color:#888;margin-top:24px;">
                                  Correo generado el ${date} por PetRadar
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
};