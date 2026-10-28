import { describe, expect, it } from 'vitest'
import { armarMensajePedido } from '../src/utils/whatsapp'

const productoConTalles = {
  nombre: 'Remera',
  stock: 10,
  talles: ['S', 'M', 'L', 'XXL'],
  precio: '12000.00',
}

const productoSinTalles = {
  nombre: 'Termo',
  stock: 5,
  talles: [],
  precio: '18000.00',
}

describe('armarMensajePedido · pedido (R2)', () => {
  it('arma el mensaje exacto del pedido con producto, color, talle y cantidad', () => {
    expect(
      armarMensajePedido(productoConTalles, { color: 'Negro', talle: 'M', cantidad: 2 }),
    ).toBe(
      'Hola! Quiero pedir: Remera, color Negro, talle M, cantidad 2. ¿Cómo seguimos?',
    )
  })

  it('sin talles el mensaje omite la parte del talle (Talle único)', () => {
    expect(
      armarMensajePedido(productoSinTalles, { color: 'Blanco', talle: null, cantidad: 1 }),
    ).toBe(
      'Hola! Quiero pedir: Termo, color Blanco, cantidad 1. ¿Cómo seguimos?',
    )
  })
})

describe('armarMensajePedido · consulta (R3)', () => {
  it('con stock = 0 pregunta por disponibilidad con color, talle y cantidad', () => {
    expect(
      armarMensajePedido({ ...productoConTalles, stock: 0 }, { color: 'Rojo', talle: 'L', cantidad: 3 }),
    ).toBe(
      'Hola! Me interesa Remera, color Rojo, talle L, cantidad 3. ¿Tienen disponibilidad?',
    )
  })

  it('con stock = 0 y sin talles omite la parte del talle', () => {
    expect(
      armarMensajePedido({ ...productoSinTalles, stock: 0 }, { color: 'Blanco', talle: null, cantidad: 1 }),
    ).toBe('Hola! Me interesa Termo, color Blanco, cantidad 1. ¿Tienen disponibilidad?')
  })
})

describe('armarMensajePedido · honestidad (R10)', () => {
  it('el mensaje nunca incluye el precio, aunque el producto lo traiga', () => {
    const mensaje = armarMensajePedido(productoConTalles, { color: 'Negro', talle: 'M', cantidad: 2 })
    expect(mensaje).not.toContain('12000')
    expect(mensaje).not.toContain('$')
  })
})
