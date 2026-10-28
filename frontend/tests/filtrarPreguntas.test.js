import { describe, expect, it } from 'vitest'
import { filtrarPreguntas } from '../src/utils/filtrarPreguntas.js'

const preguntas = [
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta: 'Elegí el producto y escribinos por WhatsApp.',
  },
  {
    pregunta: '¿Hacen envíos?',
    respuesta: 'El costo depende del destino.',
  },
  {
    pregunta: '¿Cómo pago?',
    respuesta: 'Aceptamos transferencia o efectivo al retirar.',
  },
]

describe('filtrarPreguntas', () => {
  it('devuelve todas las preguntas si la búsqueda está vacía', () => {
    expect(filtrarPreguntas(preguntas, '')).toEqual(preguntas)
    expect(filtrarPreguntas(preguntas, '   ')).toEqual(preguntas)
  })

  it('busca en las preguntas ignorando mayúsculas y tildes', () => {
    expect(filtrarPreguntas(preguntas, 'ENVÍOS')).toEqual([preguntas[1]])
    expect(filtrarPreguntas(preguntas, 'como')).toEqual([preguntas[0], preguntas[2]])
  })

  it('busca también en las respuestas', () => {
    expect(filtrarPreguntas(preguntas, 'transferencia')).toEqual([preguntas[2]])
  })

  it('requiere que todos los términos aparezcan en pregunta o respuesta', () => {
    expect(filtrarPreguntas(preguntas, 'pago efectivo')).toEqual([preguntas[2]])
    expect(filtrarPreguntas(preguntas, 'pago azul')).toEqual([])
  })
})
