const normalizar = (texto) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')

export function filtrarPreguntas(preguntas, consulta) {
  const terminos = normalizar(consulta.trim()).split(/\s+/).filter(Boolean)

  if (terminos.length === 0) return preguntas

  return preguntas.filter(({ pregunta, respuesta }) => {
    const texto = normalizar(`${pregunta} ${respuesta}`)
    return terminos.every((termino) => texto.includes(termino))
  })
}
