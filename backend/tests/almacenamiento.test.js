import { afterEach, describe, expect, it, vi } from "vitest";

const blob = vi.hoisted(() => ({ put: vi.fn(), del: vi.fn() }));
vi.mock("@vercel/blob", () => blob);

const { almacenamientoConfigurado, borrarFoto, esFotoDeBlob, subirFoto } = await import(
  "../src/services/almacenamiento.js"
);

const URL_BLOB = "https://abc123.public.blob.vercel-storage.com/productos/1/foto-x1.jpg";

afterEach(() => {
  vi.unstubAllEnvs();
  blob.put.mockReset();
  blob.del.mockReset();
});

describe("almacenamiento", () => {
  it("B3-R2 · sube la foto pública y devuelve la URL absoluta", async () => {
    blob.put.mockResolvedValue({ url: URL_BLOB });

    const url = await subirFoto("productos/1", Buffer.from("x"), "image/jpeg");

    expect(url).toBe(URL_BLOB);
    expect(blob.put).toHaveBeenCalledWith("productos/1/foto.jpg", expect.any(Buffer), {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });
  });

  it("B3-R4 · borra de Blob solo las URL de Blob, nunca las rutas del proyecto", async () => {
    expect(esFotoDeBlob(URL_BLOB)).toBe(true);
    expect(esFotoDeBlob("/img/productos/taza.webp")).toBe(false);
    expect(esFotoDeBlob("https://otro-sitio.com/foto.jpg")).toBe(false);

    expect(await borrarFoto("/img/productos/taza.webp")).toBe(false);
    expect(blob.del).not.toHaveBeenCalled();
    expect(await borrarFoto(URL_BLOB)).toBe(true);
    expect(blob.del).toHaveBeenCalledWith(URL_BLOB);
  });

  it("B3-R6 · sabe si el Blob está conectado, por OIDC o por clave", () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    vi.stubEnv("BLOB_STORE_ID", "");
    expect(almacenamientoConfigurado()).toBe(false);
    vi.stubEnv("BLOB_STORE_ID", "store_de_prueba");
    expect(almacenamientoConfigurado()).toBe(true);
    vi.stubEnv("BLOB_STORE_ID", "");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "token-de-prueba");
    expect(almacenamientoConfigurado()).toBe(true);
  });
});
