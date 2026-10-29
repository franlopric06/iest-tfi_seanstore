// Bytes mínimos que identifican cada formato, para las pruebas de fotos.
const relleno = Buffer.alloc(32, 0);

export const JPG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), relleno]);
export const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), relleno]);
export const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.from([0, 0, 0, 0]), Buffer.from("WEBP"), relleno]);
export const FALSA = Buffer.concat([Buffer.from("esto no es una imagen"), relleno]);
