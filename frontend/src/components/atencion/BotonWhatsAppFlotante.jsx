import { MessageCircle } from 'lucide-react'
import { armarEnlaceWhatsApp } from '../../utils/whatsapp.js'
import textos from '../../data/textos.js'

export default function BotonWhatsAppFlotante() {
  const enlace = armarEnlaceWhatsApp(textos.whatsapp.mensajeFlotante)
  if (!enlace) return null

  return (
    <button
      type="button"
      aria-label={textos.whatsapp.ariaFlotante}
      onClick={() => window.open(enlace, '_blank', 'noopener,noreferrer')}
      className="fixed bottom-4 right-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-whatsapp p-3 text-whatsapp-texto shadow-elevada focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
    </button>
  )
}
