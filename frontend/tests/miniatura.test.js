import { describe, expect, it } from 'vitest'
import { fuentesTarjeta, miniatura } from '../src/utils/miniatura.js'

describe('miniatura', () => {
  it('usa la copia de 480 px de las fotos del proyecto', () => {
    expect(miniatura('/img/productos/taza-blanco.webp')).toBe('/img/productos/taza-blanco-480.webp')
    expect(fuentesTarjeta('/img/productos/taza-blanco.webp')).toEqual({
      srcSet: '/img/productos/taza-blanco-480.webp 480w, /img/productos/taza-blanco.webp 1024w',
      sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
    })
  })

  it('deja tal cual las fotos subidas desde el panel y las que ya son chicas', () => {
    expect(miniatura('https://abc.public.blob.vercel-storage.com/productos/1/foto.webp')).toBeNull()
    expect(miniatura('/img/productos/taza-480.webp')).toBeNull()
    expect(fuentesTarjeta(undefined)).toEqual({})
  })
})
