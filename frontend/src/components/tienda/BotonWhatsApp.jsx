import { MessageCircle } from 'lucide-react'
import { armarEnlaceWhatsApp } from '../../utils/whatsapp'
import textos from '../../data/textos'

export function BotonWhatsApp({ mensaje, sinStock, deshabilitado }) {
  const enlace = armarEnlaceWhatsApp(mensaje)
  if (!enlace) return null

  return (
      <button
        type="button"
        onClick={() => window.open(enlace, '_blank', 'noopener,noreferrer')}
        disabled={deshabilitado}
        className="flex min-h-11 items-center justify-center gap-2 rounded-marca bg-whatsapp px-4 text-sm font-titulos text-whatsapp-texto hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5" />
        {sinStock ? textos.whatsapp.consultar : textos.whatsapp.pedir}
      </button>
  )
}
