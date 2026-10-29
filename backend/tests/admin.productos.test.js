import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";

const { consultaSimulada } = vi.hoisted(() => ({ consultaSimulada: vi.fn() }));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));

vi.stubEnv("JWT_SECRET", "secreto-de-prueba-largo");

const { default: app } = await import("../src/app.js");
const TOKEN = jwt.sign(
  { email: "admin@seanstore.com" },
  process.env.JWT_SECRET,
  { algorithm: "HS256", subject: "1", expiresIn: "2h" },
);

const productos = [
  {
    id: 1,
    codigo: "TAZ-001",
    slug: "taza-ceramica",
    nombre: "Taza de cerámica",
    categoria: { slug: "tazas-termos", nombre: "Tazas y termos" },
    precio: "12000.00",
    stock: 40,
    destacado: true,
    activo: true,
  },
  {
    id: 2,
    codigo: "REM-002",
    slug: "remera",
    nombre: "Remera",
    categoria: { slug: "indumentaria", nombre: "Indumentaria" },
    precio: "16000.00",
    stock: 0,
    destacado: false,
    activo: false,
  },
];

const comoAdmin = (metodo, ruta) =>
  request(app)[metodo](ruta).set("Authorization", `Bearer ${TOKEN}`);

beforeEach(() => {
  consultaSimulada.mockReset().mockResolvedValue({ rows: productos });
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/admin/productos", () => {
  it("B1-R14 · lista productos activos e inactivos junto con el código", async () => {
    const respuesta = await comoAdmin("get", "/api/admin/productos");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(productos);
    expect(respuesta.body.map((producto) => producto.codigo)).toEqual(["TAZ-001", "REM-002"]);
    expect(respuesta.body[1].activo).toBe(false);
    expect(consultaSimulada).toHaveBeenCalledOnce();
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/p\.codigo[\s\S]*p\.activo[\s\S]*JOIN categorias/),
      [],
    );
    expect(consultaSimulada.mock.calls[0][0]).not.toMatch(/WHERE\s+p\.activo\s*=\s*TRUE/i);
  });

  it("B2-R4 · trae los datos que necesita el formulario de edición", async () => {
    await comoAdmin("get", "/api/admin/productos");

    const sql = consultaSimulada.mock.calls[0][0];
    for (const columna of ["p.categoria_id", "p.descripcion", "p.talles", "p.colores"]) {
      expect(sql).toContain(columna);
    }
  });

  it("B1-R12 · requiere un JWT admin válido", async () => {
    const respuesta = await request(app).get("/api/admin/productos");

    expect(respuesta.status).toBe(401);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B1-R12 · protege también rutas administrativas futuras", async () => {
    const respuesta = await request(app).get("/api/admin/ruta-futura/anidada");

    expect(respuesta.status).toBe(401);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/admin/productos/:id/edicion-rapida", () => {
  it("B1-R15 · actualiza precio, stock y destacado con parámetros", async () => {
    const productoActualizado = {
      ...productos[0],
      precio: "12500.00",
      stock: 6,
      destacado: false,
    };
    consultaSimulada.mockResolvedValueOnce({ rows: [productoActualizado] });

    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/1/edicion-rapida",
    ).send({
      precio: 12500,
      stock: 6,
      destacado: false,
    });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(productoActualizado);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(
        /UPDATE productos[\s\S]*SET[\s\S]*precio\s*=\s*\$1[\s\S]*stock\s*=\s*\$2[\s\S]*destacado\s*=\s*\$3[\s\S]*WHERE id\s*=\s*\$4[\s\S]*RETURNING/i,
      ),
      [12500, 6, false, "1"],
    );
  });

  it.each([
    ["precio negativo", { precio: -1, stock: 2, destacado: true }],
    ["precio no numérico", { precio: "12000", stock: 2, destacado: true }],
    ["stock negativo", { precio: 100, stock: -1, destacado: true }],
    ["stock decimal", { precio: 100, stock: 1.5, destacado: true }],
    ["destacado no booleano", { precio: 100, stock: 2, destacado: "true" }],
  ])("B1-R16 · rechaza %s antes de consultar la base", async (_caso, cuerpo) => {
    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/1/edicion-rapida",
    ).send(cuerpo);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B1-R15 · responde 404 cuando el producto no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/999/edicion-rapida",
    ).send({
      precio: 100,
      stock: 2,
      destacado: true,
    });

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/UPDATE productos/),
      [100, 2, true, "999"],
    );
  });
});

const cuerpoProducto = {
  nombre: "Taza nueva",
  categoria_id: 1,
  precio: 15000,
  stock: 25,
  descripcion: "Taza estampada con el diseño que elijas.",
  talles: [],
  colores: ["Blanco"],
  destacado: false,
};

const filaCreada = {
  id: 13,
  codigo: "TAZ-003",
  slug: "taza-nueva",
  nombre: "Taza nueva",
  precio: "15000.00",
  stock: 25,
  destacado: false,
  activo: true,
};

describe("POST /api/admin/productos", () => {
  it("B2-R1..R3 · crea con código y slug generados y todos los valores por parámetros", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ codigo: "TAZ-001" }, { codigo: "TAZ-002" }] })
      .mockResolvedValueOnce({
        rows: [{ slug: "taza-ceramica" }, { slug: "taza-polimero" }],
      })
      .mockResolvedValueOnce({ rows: [filaCreada] });

    const respuesta = await comoAdmin("post", "/api/admin/productos").send(cuerpoProducto);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual(filaCreada);
    expect(consultaSimulada).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/SELECT id FROM categorias/i),
      [1],
    );
    expect(consultaSimulada).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/SELECT codigo FROM productos[\s\S]*LIKE/i),
      ["TAZ-%"],
    );
    expect(consultaSimulada).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(/slug = \$1[\s\S]*slug LIKE \$2/s),
      ["taza-nueva", "taza-nueva-%"],
    );
    expect(consultaSimulada).toHaveBeenNthCalledWith(
      4,
      expect.stringMatching(/INSERT INTO productos[\s\S]*VALUES[\s\S]*\$11/s),
      [
        "TAZ-003",
        "taza-nueva",
        "Taza nueva",
        1,
        15000,
        25,
        "Taza estampada con el diseño que elijas.",
        [],
        ["Blanco"],
        false,
        true,
      ],
    );
  });

  it("B2-R6 · rechaza datos inválidos sin consultar la base", async () => {
    const respuesta = await comoAdmin("post", "/api/admin/productos").send({
      ...cuerpoProducto,
      precio: -1,
    });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B2-R6 · rechaza el campo desconocido del cuerpo", async () => {
    const respuesta = await comoAdmin("post", "/api/admin/productos").send({
      ...cuerpoProducto,
      extra: true,
    });

    expect(respuesta.status).toBe(400);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B2-R6 · rechaza cuando la categoría no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin("post", "/api/admin/productos").send(cuerpoProducto);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/categor/i);
    expect(consultaSimulada).toHaveBeenCalledTimes(1);
  });

  it("B2-R2 · reintenta y crea cuando el código choca con la restricción única", async () => {
    const errorColision = new Error("duplicate key");
    errorColision.code = "23505";
    const filaReintento = { ...filaCreada, codigo: "TAZ-004", slug: "taza-nueva-2" };
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ codigo: "TAZ-001" }, { codigo: "TAZ-002" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockRejectedValueOnce(errorColision)
      .mockResolvedValueOnce({ rows: [{ codigo: "TAZ-003" }] })
      .mockResolvedValueOnce({ rows: [{ slug: "taza-nueva" }] })
      .mockResolvedValueOnce({ rows: [filaReintento] });

    const respuesta = await comoAdmin("post", "/api/admin/productos").send(cuerpoProducto);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual(filaReintento);
    const inserciones = consultaSimulada.mock.calls.filter(([sql]) => /INSERT INTO/i.test(sql));
    expect(inserciones).toHaveLength(2);
    expect(inserciones[1][1]).toEqual([
      "TAZ-004",
      "taza-nueva-2",
      "Taza nueva",
      1,
      15000,
      25,
      "Taza estampada con el diseño que elijas.",
      [],
      ["Blanco"],
      false,
      true,
    ]);
  });

  it("B2-R2 · avisa el error explícito cuando no logra un código o slug único", async () => {
    const errorColision = new Error("duplicate key");
    errorColision.code = "23505";
    consultaSimulada.mockImplementation((sql) => {
      if (/INSERT INTO/i.test(sql)) {
        return Promise.reject(errorColision);
      }
      if (/FROM categorias/i.test(sql)) {
        return Promise.resolve({ rows: [{ id: 1 }] });
      }
      return Promise.resolve({ rows: [] });
    });

    const respuesta = await comoAdmin("post", "/api/admin/productos").send(cuerpoProducto);

    expect(respuesta.status).toBe(409);
    expect(respuesta.body).toHaveProperty("error");
    const inserciones = consultaSimulada.mock.calls.filter(([sql]) => /INSERT INTO/i.test(sql));
    expect(inserciones).toHaveLength(3);
  });
});

const filaEditada = {
  id: 13,
  codigo: "TAZ-003",
  slug: "taza-nueva",
  nombre: "Taza editada",
  precio: "16000.00",
  stock: 18,
  destacado: true,
  activo: true,
};

describe("PATCH /api/admin/productos/:id", () => {
  const cuerpoEdicion = {
    nombre: "Taza editada",
    categoria_id: 2,
    precio: 16000,
    stock: 18,
    descripcion: "Taza con la descripción nueva.",
    talles: [],
    colores: ["Blanco", "Negro"],
    destacado: true,
  };

  it("B2-R4 · edita nombre y datos y devuelve el producto con su código y slug intactos", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })
      .mockResolvedValueOnce({ rows: [filaEditada] });

    const respuesta = await comoAdmin("patch", "/api/admin/productos/13").send(cuerpoEdicion);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(filaEditada);
    expect(consultaSimulada).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/SELECT id FROM categorias/i),
      [2],
    );
    const [sql, parametros] = consultaSimulada.mock.calls[1];
    expect(sql).toMatch(/UPDATE productos[\s\S]*SET[\s\S]*WHERE id = \$9/s);
    expect(sql).not.toMatch(/codigo\s*=/);
    expect(sql).not.toMatch(/slug\s*=/);
    expect(parametros).toEqual([
      "Taza editada",
      2,
      16000,
      18,
      "Taza con la descripción nueva.",
      [],
      ["Blanco", "Negro"],
      true,
      "13",
    ]);
  });

  it("B2-R6 · rechaza datos inválidos sin consultar la base", async () => {
    const respuesta = await comoAdmin("patch", "/api/admin/productos/13").send({
      ...cuerpoEdicion,
      stock: -1,
    });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B2-R6 · rechaza cambiar activo por la edición completa", async () => {
    const respuesta = await comoAdmin("patch", "/api/admin/productos/13").send({
      ...cuerpoEdicion,
      activo: false,
    });

    expect(respuesta.status).toBe(400);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B2-R6 · rechaza cuando la categoría no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin("patch", "/api/admin/productos/13").send(cuerpoEdicion);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/categor/i);
    expect(consultaSimulada).toHaveBeenCalledTimes(1);
  });

  it("B2-R4 · responde 404 cuando el producto no existe", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })
      .mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin("patch", "/api/admin/productos/13").send(cuerpoEdicion);

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty("error");
  });
});

describe("PATCH /api/admin/productos/:id/estado", () => {
  it("B2-R5 · oculta y reactiva el producto con activo, sin borrar la fila", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [{ ...filaEditada, activo: false }] });

    const respuesta = await comoAdmin("patch", "/api/admin/productos/13/estado").send({
      activo: false,
    });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.activo).toBe(false);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/UPDATE productos\s+SET activo = \$1\s+WHERE id = \$2\s+RETURNING/s),
      [false, "13"],
    );

    consultaSimulada.mockResolvedValueOnce({ rows: [filaEditada] });
    const reactivado = await comoAdmin("patch", "/api/admin/productos/13/estado").send({
      activo: true,
    });
    expect(reactivado.status).toBe(200);
    expect(reactivado.body.activo).toBe(true);
  });

  it.each([
    ["activo no booleano", { activo: "true" }],
    ["cuerpo vacío", {}],
    ["campos de más", { activo: true, extra: 1 }],
  ])("B2-R6 · rechaza %s sin consultar la base", async (_caso, cuerpo) => {
    const respuesta = await comoAdmin("patch", "/api/admin/productos/13/estado").send(cuerpo);

    expect(respuesta.status).toBe(400);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B2-R5 · responde 404 cuando el producto no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin("patch", "/api/admin/productos/999/estado").send({
      activo: true,
    });

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/UPDATE productos\s+SET activo/),
      [true, "999"],
    );
  });
});
