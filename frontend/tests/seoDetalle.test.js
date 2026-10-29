import { describe, expect, it } from 'vitest'
import seoDetalle from '../src/utils/seoDetalle.js'

const producto = {
  nombre: 'Taza',
  codigo: 'TAZ-001',
  slug: 'taza',
  categoria: { nombre: 'Tazas y termos', slug: 'tazas-termos' },
  fotos: [
    { url: '/img/productos/taza.webp' },
    { url: 'https://abc.public.blob.vercel-storage.com/productos/1/foto.jpg' },
  ],
}

describe('seoDetalle', () => {
  it('B3-R7 · antepone el sitio a las rutas del proyecto y deja intactas las URL de Blob', () => {
    const texto = JSON.stringify(seoDetalle(producto))

    expect(texto).toContain('https://sean-store.vercel.app/img/productos/taza.webp')
    expect(texto).toContain('"https://abc.public.blob.vercel-storage.com/productos/1/foto.jpg"')
    expect(texto).not.toContain('vercel.apphttps')
  })
})
