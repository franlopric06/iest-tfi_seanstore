# Fichas de las piezas generadas con IA (Anexo III)

En este archivo está registrada cada imagen generada con inteligencia artificial para Sean's Store: las **55 fotos de productos** y las **8 imágenes de la consigna 4.1** (taller, clienta, imagen para compartir y mockups).

Para que se pueda leer sin repetir lo mismo 63 veces, las fichas están agrupadas por familia de producto. Lo que todas las piezas de un grupo comparten (herramienta, escena, prompt base, licencia y leyenda) se escribe una sola vez arriba. Lo propio de cada pieza (diseño, intentos, qué falló y qué se editó a mano) va en su fila de la tabla.

## Datos comunes a todas las piezas

| Campo | Contenido |
| --- | --- |
| Tipo | Imagen fotorrealista. |
| Herramienta y modelo | Google Gemini (aplicación web, plan gratuito con cuenta de Google). |
| Fechas | Productos: 21 y 22/10/2026. Imágenes de la consigna 4.1: 28/10/2026. |
| Forma de trabajo | Un prompt por vez. Antes de cada prompt charlé con Claude el diseño, la frase y los colores, y después revisé cada resultado antes de seguir. Todos los prompts piden el tamaño al principio y al final (1024 × 1024 px, formato 1:1). |
| Referencias | Fotos de lugares de Tinogasta descargadas de publicaciones de turismo: la iglesia del reloj al atardecer, la iglesia de adobe con la Vía Láctea (foto de @facundo_carrizo24), la iglesia de Nuestra Señora de Andacollo en La Falda, el puente colgante del Ecoparque Andalucas, la copa de vino con los cerros, las letras TINOGASTA al atardecer y el cartel YO ❤ TINOGASTA de la plaza. Además, en muchas piezas se adjuntó una foto ya aprobada como modelo, para mantener el mismo producto o la misma escena. |
| Edición humana común | Pasar cada imagen a WebP para el sitio (los originales en JPG van en `multimedia/imagenes/`) y ponerle nombre con la regla `producto-color-diseño`. |
| Licencia | Según los términos de Google, Google no reclama la propiedad de lo que genera Gemini y quien lo genera es responsable de cómo lo usa. Las imágenes se usan con fines académicos en un sitio de demostración. Las imágenes de Gemini llevan además una marca de agua invisible de Google (SynthID) que permite detectar que fueron generadas con IA. |
| Leyenda en el sitio | Cada foto muestra la leyenda «Generado con IA» sobre la imagen (en la tarjeta y en la galería del detalle). |
| Pendiente ético | La foto de la iglesia de adobe con la Vía Láctea es de @facundo_carrizo24 y se le pidió a Gemini que borrara su firma. **[Pendiente: decidir si se le pide permiso y se lo cita, o se reemplaza ese diseño por una referencia con licencia libre.]** |

## Lo que aprendí de Gemini en el camino

- Si se le nombra un lugar solo con texto, **lo inventa**. Para que salga reconocible hay que adjuntar la foto y pedir «estampá la imagen adjunta tal cual, sin inventar ni cambiar nada».
- Para mantener el mismo producto en otro color conviene abrir un **chat nuevo** con la foto ya aprobada como modelo. Si se sigue en el mismo chat, a veces «se acuerda mal» y cambia la forma del producto.
- Los cambios simples de color o de texto sí funcionan en el mismo chat con «usá exactamente la misma… solo cambiá…». Cuando ignoraba un color, escribirlo en **MAYÚSCULAS** lo resolvió.
- A veces escribe mal las palabras (por ejemplo «FRÃŠE» o «AFNTINAS») o pierde las tildes, así que **siempre hay que revisar el texto**.
- En la ropa, el texto salía plano, como pegado encima. Se arregló pidiendo que «se integre a las ondas y arrugas de la tela, como una serigrafía real».

---

## 1. Tazas de cerámica (7 fotos)

**Escena:** taza sobre mesa de madera clara, florero chico con flores secas, pared crema y luz cálida.

**Prompt base** (el de la taza verde claro; las otras cambian el color, la foto adjunta y el texto):

> Generá una imagen cuadrada de 1024 x 1024 píxeles (formato 1:1). Es una foto de producto realista de una taza de cerámica color verde claro suave, tipo verde salvia, con terminación mate. Estampá en el frente de la taza la imagen adjunta tal cual, sin inventar ni cambiar el paisaje: la copa de vino tinto sobre la roca, con los cerros y el cielo azul de fondo. El estampado tiene que adaptarse a la curva de la taza, como una sublimación de buena calidad, con los bordes que se funden suavemente con el verde de la taza. Sobre la parte de abajo de la imagen, encima de la roca naranja, agregá el texto "Tinogasta" en letra elegante color bordó, y abajo, más chico, "tierra de vinos", también en bordó. Escribí los textos exactamente así. La taza está apoyada sobre una mesa de madera clara, con la manija hacia la derecha, y al costado hay un florero chico de cerámica con flores secas. El fondo es una pared lisa color crema, desenfocada, con luz natural cálida de costado. La taza va centrada y entera dentro del cuadro, sin recortar la manija. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 1 | taza-ceramica-blanco-iglesia-reloj | Iglesia del reloj al atardecer, «Atardecer en Tinogasta» en marrón | 2 | El primero inventó la iglesia; se repitió con la foto adjunta. Salió rectangular y la recorté a cuadrado. |
| 2 | taza-ceramica-negro-iglesia-adobe | Iglesia de adobe con la Vía Láctea, «Ruta del Adobe / Tinogasta» en dorado | 1 | Se pidió borrar la firma del fotógrafo. |
| 3 | taza-ceramica-beige-iglesia-andacollo | Iglesia de Andacollo, «Atardeceres que se sienten / Tinogasta ♥» en blanco con corazón rojo | 1 | El texto se ubicó sobre la parte oscura de la foto para que el blanco se lea sobre el beige. |
| 4 | taza-ceramica-verde-claro-copa-vino | Copa de vino con cerros, «Tinogasta / tierra de vinos» en bordó | 1 | — |
| 5 | taza-ceramica-blanco-tu-nombre | «TU NOMBRE» | 1 | Personalizable. |
| 6 | taza-ceramica-negro-tu-marca | «TU MARCA AQUÍ» | 1 | Personalizable. |
| 7 | taza-ceramica-beige-tu-frase | «TU FRASE» | 1 | Personalizable. |

## 2. Termos (7 fotos)

**Escena:** la misma de las tazas. Desde el segundo termo se adjuntó primero la foto del termo ya hecho como modelo.

**Prompt base** (termo blanco):

> Te paso dos imágenes. La primera es el modelo del termo: usá exactamente esa forma, esa tapa redondeada tipo cúpula y esas proporciones. La segunda es el diseño que va estampado. Generá una imagen cuadrada de 1024 x 1024 píxeles (formato 1:1) con una foto de producto realista de ese mismo modelo de termo, pero de color blanco mate, con la tapa del mismo color. Estampá en el frente del termo la segunda imagen tal cual, sin inventar ni cambiar nada: la misma iglesia de ladrillo rojo con la torre de los dos relojes y el techo azul puntiagudo, con el cielo del atardecer en naranja, rosa y violeta. El estampado va en vertical y se adapta a la curva del termo, como una sublimación de buena calidad. Debajo de la imagen, sobre el blanco del termo, agregá el texto "Atardecer en Tinogasta" en letra cursiva elegante color marrón oscuro. Escribilo exactamente así. El termo está parado sobre una mesa de madera clara, con un florero chico de cerámica con flores secas al costado, sobre un fondo de pared lisa color crema, desenfocada, con luz natural cálida. El termo va centrado y entero. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 8 | termo-negro-ecoparque-andalucas | Puente colgante del Ecoparque, «Ecoparque Andalucas / Tinogasta» en blanco | 1 | Es el modelo de los demás termos. |
| 9 | termo-verde-claro-iglesia-adobe | Iglesia de adobe, «Ruta del Adobe / Tinogasta» en dorado | 3 | Cambió la forma del termo y después inventó otra iglesia. Se resolvió en un chat nuevo adjuntando el modelo y la foto. |
| 10 | termo-rosa-iglesia-andacollo | Iglesia de Andacollo | 1 | — |
| 11 | termo-blanco-iglesia-reloj | Iglesia del reloj, «Atardecer en Tinogasta» en marrón | 1 | Letra igual a la de la taza blanca para que hagan juego. |
| 12 | termo-blanco-tu-nombre | «TU NOMBRE» | 1 | Personalizable. |
| 13 | termo-negro-tu-marca | «TU MARCA AQUÍ» | 1 | Personalizable. |
| 14 | termo-rosa-tu-frase | «TU FRASE» | 1 | Personalizable. |

## 3. Botellas deportivas (6 fotos)

**Escena:** la misma mesa. Frase motivadora en vertical con una silueta chica de cerros, porque la botella es para entrenar.

**Prompt de ejemplo** (botella blanca, en el mismo chat de la anterior):

> Usá exactamente la misma botella de la imagen anterior: misma forma, misma tapa deportiva con asa, mismas proporciones, misma mesa, florero y fondo. Solo cambiá dos cosas: el color de la botella a blanco mate, y la frase a "Más fuerte que ayer", en letra negra, grande, gruesa y moderna, escrita en vertical a lo largo de la botella, de abajo hacia arriba. Cambiá también la silueta chiquita de cerros al pie de la frase a color negro. Escribí la frase exactamente así, con tilde en la "a" de "Más". La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 15 | botella-negro-no-pares | «No pares» con silueta de cerros | 1 | — |
| 16 | botella-azul-un-paso-mas | «Un paso más» | 2 | Se rehízo con un azul más vivo. |
| 17 | botella-blanco-mas-fuerte-que-ayer | «Más fuerte que ayer» | 1 | — |
| 18 | botella-negro-tu-nombre | «TU NOMBRE» | 1 | Pedí una botella blanca y Gemini la dejó negra. Como quedó bien, cambié el reparto de colores en vez de repetirla. |
| 19 | botella-blanco-tu-marca | «TU MARCA AQUÍ» | 1 | Escribí «BLANCO» en mayúsculas para que no lo ignorara otra vez. |
| 20 | botella-azul-tu-frase | «TU FRASE» | 2 | El primero salió con letras raras («FRÃŠE»); también se pidió un azul más vivo. |

## 4. Remeras (5 fotos)

**Escena:** remera estirada, vista de frente, sobre fondo gris claro liso con luz de estudio.

**Prompt base** (remera blanca):

> Generá una imagen cuadrada de 1024 x 1024 píxeles (formato 1:1). Es una foto de producto realista de una remera de algodón blanca, de cuello redondo y manga corta, estirada y vista de frente sobre un fondo liso color gris muy claro, con una sombra suave y luz pareja de estudio. Estampá en el pecho de la remera la imagen adjunta tal cual, sin inventar ni cambiar nada: las letras de colores que dicen TINOGASTA, con el árbol y los cerros con el cielo del atardecer de fondo. Dejá afuera la ruta de asfalto de la parte de abajo de la foto. El estampado va centrado en el pecho, en tamaño mediano, con los bordes que se funden suavemente con el blanco de la tela, y tiene que verse como una sublimación de buena calidad, siguiendo las arrugas naturales del algodón. La remera va centrada y entera dentro del cuadro, sin recortar las mangas. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 21 | remera-blanco-letras-tinogasta | Letras TINOGASTA al atardecer | 1 | Se dejó afuera la ruta de la foto original. |
| 22 | remera-negro-cartel-plaza | Cartel YO ❤ TINOGASTA de la plaza | 1 | Una primera versión solo con texto se descartó; preferí la foto del cartel real. |
| 23 | remera-gris-tu-nombre | «TU NOMBRE» | 1 | Personalizable. |
| 24 | remera-azul-tu-marca | «TU MARCA AQUÍ» | 1 | Personalizable. |
| 25 | remera-rojo-tu-frase | «TU FRASE» | 2 | El primero salió bordó en vez de rojo. |

## 5. Buzos (5 fotos)

**Escena:** buzo colgado de una percha de madera en un perchero de madera, con un mueble y el florero al costado, para que combine con el resto de las fotos.

**Prompt base** (buzo gris; se adjuntó el termo blanco «TU NOMBRE» como referencia del ambiente):

> Usá la imagen adjunta solo como referencia del ambiente: misma pared lisa color crema, misma luz natural cálida y el mismo estilo de florero chico de cerámica con flores secas. Generá una imagen cuadrada de 1024 x 1024 píxeles (formato 1:1) con una foto de producto realista de un buzo de algodón color gris melange, con capucha, bolsillo canguro adelante, puños y cintura elásticos. El buzo está colgado de una percha de madera, en un perchero de madera, visto de frente y bien estirado para que se vea todo el pecho. En el centro del pecho lleva el texto "TU NOMBRE" en letra blanca, grande, gruesa y moderna. Escribí el texto exactamente así. Al costado, sobre un mueble chico de madera clara, está el florero con flores secas. El estampado tiene que verse como una impresión de buena calidad que sigue las arrugas naturales de la tela. El buzo va centrado y entero dentro del cuadro, sin recortar las mangas, la capucha ni la percha. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

**Corrección que se agregó desde el segundo intento:** «MUY IMPORTANTE: el texto tiene que integrarse a las ondas y arrugas del buzo… como una serigrafía real».

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 26 | buzo-gris-tu-nombre | «TU NOMBRE» | 2 | El texto se veía pegado encima, sin seguir la tela. Lo detecté yo y se corrigió. |
| 27 | buzo-azul-tu-marca | «TU MARCA AQUÍ» | 2 | Mismo problema del texto pegado. |
| 28 | buzo-negro-tu-frase | «TU FRASE» | 1 | Con el «MUY IMPORTANTE» desde el principio salió bien de una. |
| 29 | buzo-negro-iglesia-adobe | Iglesia de adobe, «Ruta del Adobe / Tinogasta» en dorado | 1 | — |
| 30 | buzo-blanco-cartel-plaza | Cartel YO ❤ TINOGASTA | 1 | Un buzo blanco estilo universitario se descartó. |

## 6. Camperas (5 fotos)

**Escena:** perchero más ancho con dos camperas iguales: una de frente, con el cierre y los cordones, y otra de espaldas. Así se ve que es una campera y no un buzo, y se muestran las dos opciones de personalización. La idea de mostrar las dos camperas fue mía.

**Prompt base** (campera gris grafito):

> Mantené la misma escena: el mismo estilo de perchero de madera, la pared crema, el mueble de madera con el florero de flores secas y la misma luz cálida. Pero hacé el perchero más ancho y alejá la cámara para que entre todo. En el perchero colgá DOS camperas iguales de friza color gris grafito oscuro, con capucha, cada una en su percha de madera, una al lado de la otra. La de la izquierda se ve DE FRENTE: con el cierre cerrado, los dos cordones de la capucha colgando, y en el pecho izquierdo un texto chico "TU NOMBRE" en letra blanca, gruesa y moderna, como un logo. La de la derecha se ve DE ESPALDAS: en el centro de la espalda, un recuadro con línea punteada blanca y adentro el texto "TU MARCA AQUÍ" en letra blanca, gruesa y moderna. Las dos camperas tienen que ser exactamente el mismo modelo y el mismo color. Escribí los textos exactamente así, con tilde en la "i" de "AQUÍ". MUY IMPORTANTE: los textos tienen que integrarse a las ondas y arrugas de la tela, impresos y no pegados encima, con un blanco apenas menos brillante, como una serigrafía real. Las dos camperas van enteras, sin recortar mangas, capuchas ni perchas. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 31 | campera-negro-tu-nombre-tu-marca | «TU NOMBRE» adelante y «TU MARCA AQUÍ» atrás | 3 | De espaldas sola parecía un buzo; después el gris se pasó a negro y el texto quedó flotando. |
| 32 | campera-gris-tu-logo-tu-frase | «TU LOGO» y «TU FRASE» | 2 | El texto de la espalda salió demasiado grande. |
| 33 | campera-azul-tu-marca-tu-nombre | «TU MARCA AQUÍ» y «TU NOMBRE» | 1 | — |
| 34 | campera-blanco-ruta-del-adobe | Iglesia vista desde el algarrobo, letra terracota | 1 | — |
| 35 | campera-negro-iglesia-reloj | Iglesia del reloj, «Atardecer en Tinogasta» | 1 | — |

## 7. Gorras (3 fotos)

**Escena:** gorra trucker de un solo color sobre la mesa redonda con el florero, en plano lejano. El diseño va sublimado directo en el frente, sin parche.

**Prompt de ejemplo** (gorra blanca, en el mismo chat de la negra):

> Mantené exactamente la misma composición de la imagen anterior: el mismo plano lejano, la misma mesa redonda entera con sus patas, el florero, la pared, el piso, la luz y la gorra en el mismo lugar y del mismo tamaño chico. Solo cambiá la gorra: ahora es una gorra trucker toda BLANCA (frente, red y visera blancos), vista a 3/4. En el frente lleva estampada directamente la imagen adjunta tal cual, sin inventar nada: el cartel blanco que dice "YO", el corazón rojo y "TINO GASTA", con los árboles y las plantas de la plaza. Es una impresión sublimada directa sobre la tela, no un parche, que ocupa el frente de la gorra y cuyos bordes se funden suavemente con el blanco. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

**Edición humana común:** Gemini sacaba la gorra muy grande, así que le pedimos un plano lejano y después Claude recortó las tres al mismo tamaño para que quedaran parejas.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 36 | gorra-negro-iglesia-adobe | Iglesia de adobe | 4 | Salieron dos gorras, después un parche bordado y después la gorra muy grande. Recorte manual. |
| 37 | gorra-blanco-cartel-plaza | Cartel YO ❤ TINOGASTA | 1 | El «YO» salió un poco deformado y se aceptó. Recorte manual. |
| 38 | gorra-azul-tu-logo | «TU LOGO» | 1 | Recorte manual. Una gorra marrón se descartó. |

## 8. Canilleras (3 fotos)

**Escena:** par de canilleras acostadas sobre la mesa, vistas desde arriba, con el florero en una esquina. Pedí la vista desde arriba porque de costado se notaba que era IA.

**Prompt base** (canilleras negras, se adjuntó la gorra negra por la madera y el florero):

> Usá la imagen adjunta solo como referencia de los materiales: la misma madera clara de la mesa, el mismo florero chico de cerámica con flores secas y la misma luz natural cálida. Generá una imagen cuadrada de 1024 x 1024 píxeles (formato 1:1) con una foto de producto realista tomada DESDE ARRIBA, en vista cenital, mirando hacia abajo a la superficie de la mesa de madera, que ocupa todo el fondo de la foto y en la que se ve bien la veta. Sobre la mesa hay un PAR de canilleras de fútbol color negro, ACOSTADAS y bien apoyadas sobre la madera, una al lado de la otra, levemente inclinadas, con su sombra suave sobre la mesa. En una esquina de la foto se ve, desde arriba, el florero con las flores secas. En el frente de cada canillera va un diseño gráfico deportivo sublimado: líneas diagonales de velocidad y formas geométricas en blanco y azul vivo tipo azul rey, sin ningún texto. Las dos llevan el mismo diseño, que sigue la curva de la canillera y se ve impreso en el material. Que parezca una foto real de tienda, no generada. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 39 | canilleras-negro-diseno-deportivo | Líneas de velocidad en blanco y azul | 2 | El primero tenía una pelota que parecía de juguete y una canillera flotando. |
| 40 | canilleras-blanco-tu-nombre-10 | «TU NOMBRE» y el número 10 | 1 | — |
| 41 | canilleras-negro-argentina-malvinas | Bandera argentina y «LAS MALVINAS SON ARGENTINAS» | 3 | Escribió «AFNTINAS». Después pedí fondo blanco con letra negra para que se lea mejor. |

## 9. Llaveros (4 fotos)

**Escena:** placa rectangular vertical, como las que compra y sublima el negocio, vista desde arriba sobre la mesa, con la argolla y la cadenita.

**Prompt de ejemplo** (llavero de acrílico, chat nuevo adjuntando el llavero blanco como base):

> Usá exactamente el mismo llavero de la imagen adjunta: la misma forma rectangular vertical, el mismo tamaño, las mismas esquinas redondeadas, el mismo agujero, la argolla, la cadenita, la mesa, el florero, la vista desde arriba y la luz. Solo cambiá dos cosas: 1) El material: ahora la placa es de ACRÍLICO TRANSPARENTE de unos 3 mm, cristalino, con los bordes pulidos que brillan, pequeños reflejos, una sombra suave y clara, y a través de las partes sin impresión se ve la veta de la madera. 2) El diseño: sacá la imagen de la iglesia y "Tinogasta", y poné "YO ❤ TINOGASTA" escrito a lo largo de la placa, de abajo hacia arriba, en una sola línea en vertical, con las letras blancas lisas y el corazón rojo liso, sin bordes negros. Escribí el texto exactamente así. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 42 | llavero-blanco-iglesia-reloj | Iglesia del reloj | 5 | La argolla no quedaba enganchada, sobraban márgenes y el aro tenía volumen de más. |
| 43 | llavero-transparente-yo-amo-tinogasta | YO ❤ TINO / GASTA | Varios | Gemini nunca logró el texto bien armado: se comía «TINO» o lo dejaba chico. Gemini hizo la placa de acrílico vacía y **Claude agregó el diseño aparte** con edición de imagen. No es una imagen solo de Gemini. |
| 44 | llavero-negro-tu-nombre | «TU NOMBRE» | 1 | — |
| 45 | llavero-blanco-tu-logo | «TU LOGO» | 1 | — |

## 10. Mousepads (4 fotos)

**Escena:** mousepad casi cuadrado (22 × 18 cm) con la imagen hasta el borde y sin costura, visto desde arriba, con un mouse negro.

**Prompt de ejemplo** (letras TINOGASTA, en el mismo chat del anterior):

> Mantené exactamente la misma escena: la misma vista desde arriba, la mesa, el florero, la luz, el mismo mousepad casi cuadrado con la imagen hasta el borde y sin costura, en la misma posición, y el mouse negro en el mismo lugar. Solo cambiá el diseño: sacá la imagen del puente y el texto, y sublimá en toda la superficie la imagen adjunta tal cual, sin inventar ni cambiar nada: las letras de colores que dicen TINOGASTA, con el árbol y los cerros con el cielo del atardecer. Dejá afuera la ruta de asfalto de abajo. Las letras TINOGASTA tienen que verse completas y legibles, sin que el mouse las tape. No agregues ningún otro texto. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 46 | mousepad-blanco-ecoparque-andalucas | Puente del Ecoparque | 4 | Salía muy alargado, y un borde negro cosido parecía bordado. |
| 47 | mousepad-blanco-letras-tinogasta | Letras TINOGASTA | 2 | El mouse tapaba la última «A»; se movió a una esquina. |
| 48 | mousepad-blanco-tu-marca | «TU MARCA AQUÍ» | 1 | — |
| 49 | mousepad-negro-tu-logo | «TU LOGO» | 1 | — |

## 11. Almohadones (6 fotos)

**Escena:** almohadón sobre una cama con sábanas claras y cabecera de madera, con luz de mañana. Solo texto, en letra con serifa, sin comillas ni recuadro.

**Prompt de ejemplo** (blanco «TU FRASE», en el mismo chat del gris):

> Mantené exactamente la misma imagen: el mismo almohadón, la cama, las sábanas, la cabecera, la luz, la posición, el mismo texto "TU FRASE" en dos renglones, sin comillas, con el mismo estilo y tamaño de letra. Solo cambiá dos cosas: el color de la tela del almohadón a BLANCO y el color de la letra a NEGRO. No agregues comillas ni ningún otro signo. La imagen final tiene que ser cuadrada, de 1024 x 1024 píxeles.

**Edición humana común:** el texto quedaba corrido hacia un costado y Gemini no lo movía aunque se lo pidiera. **Claude centró el texto de los seis** con edición de imagen.

| N.° | Archivo | Diseño y texto | Intentos | Qué pasó y edición humana |
| --- | --- | --- | --- | --- |
| 50 | almohadon-blanco-tu-frase.webp | «TU FRASE» | 2 | Las primeras versiones tenían comillas y recuadro; las saqué. Texto centrado a mano. |
| 51 | almohadon-gris-tu-frase.webp | «TU FRASE» | 1 | Texto centrado a mano. |
| 52 | almohadon-verde-claro-tu-frase.webp | «TU FRASE» | 1 | Texto centrado a mano. |
| 53 | almohadon-blanco-tu-diseno.webp | «TU DISEÑO AQUÍ» | 1 | Texto centrado a mano. |
| 54 | almohadon-gris-tu-diseno.webp | «TU DISEÑO AQUÍ» | 1 | Texto centrado a mano. |
| 55 | almohadon-verde-claro-tu-diseno.webp | «TU DISEÑO AQUÍ» | 1 | Texto centrado a mano. |

---

## 12. Imágenes de la consigna 4.1 (8 piezas, 28/10/2026)

Son las imágenes que pide la consigna además de los productos: el espacio de trabajo, una persona usando el servicio, una imagen para compartir y los mockups del sitio. Todas están ambientadas en Tinogasta, sin marcas reales y con personas inventadas.

Los prompts completos están debajo de cada ficha.

### N.° 56 · Nuestro taller

| Campo | Contenido |
| --- | --- |
| Archivo | nuestro-taller |
| Descripción | Interior de un taller de sublimación, sin personas: mesa de madera con la plancha térmica y una impresora sin marca, estantes de madera con tazas, termos, botellas y remeras, pared de adobe y una ventana con los cerros rojizos. Luz cálida de tarde. |
| Herramienta y fecha | Gemini, 28/10/2026. |
| Prompt final | Ver abajo. |
| Intentos | 1, en un chat nuevo, sin foto de referencia. |
| Edición humana | Recorte mínimo a formato 16:9 (1017 × 572) y paso a WebP. |
| Uso | Sección «Nuestro taller» de la portada. |
| Leyenda | «Imagen ilustrativa generada con IA (Gemini). Representa un taller de sublimación ambientado en Tinogasta.» |

**Prompt final:**

> Generá una imagen horizontal en formato 16:9 (1600 x 900 píxeles). Es una foto realista, como tomada con cámara profesional, del interior de un pequeño taller de sublimación y productos personalizados en un pueblo del noroeste argentino. A la izquierda, sobre una mesa de trabajo de madera maciza, hay una prensa térmica plana para remeras, una impresora de escritorio blanca, hojas de papel de sublimación y un diseño a medio preparar. Contra la pared del fondo hay estantes de madera con productos terminados y ordenados: tazas de cerámica blancas y de colores, termos, botellas deportivas y algunas remeras dobladas, todos con estampados coloridos de paisajes y frases cortas. Una de las paredes tiene terminación de adobe, rústica, color tierra. A la derecha hay una ventana amplia por la que se ven cerros áridos de color rojizo y un cielo azul limpio, como en Tinogasta, Catamarca. La luz es natural y cálida, de media tarde, entrando por la ventana, con sombras suaves. El lugar está ordenado, prolijo y acogedor, con alguna planta en maceta de barro. No hay personas. MUY IMPORTANTE: ninguna máquina ni producto puede tener marcas, logos ni textos legibles; todo sin marca. Que parezca una foto real de un local, no un render. La imagen final tiene que ser horizontal, en formato 16:9.

### N.° 57 · Clienta en el taller

| Campo | Contenido |
| --- | --- |
| Archivo | nuestro-taller-clienta |
| Descripción | Una clienta ficticia, mujer joven de unos 25 años, recibe y mira una remera blanca con las letras TINOGASTA. Del vendedor solo se ven las manos. Mismo taller de fondo. |
| Herramienta y fecha | Gemini, 28/10/2026. |
| Prompt final | Ver abajo. |
| Intentos | 1, en un chat nuevo. Referencias: la foto del taller y la remera blanca con las letras, las dos generadas con IA. |
| Edición humana | Recorte a 16:9 y paso a WebP. |
| Uso | Sección «Nuestro taller» de la portada. |
| Leyenda | «Imagen ilustrativa generada con IA (Gemini). La persona es ficticia.» |
| Nota ética | La persona no existe. No se usó la cara ni la imagen de nadie real. |

**Prompt final** (adjuntando nuestro-taller y remera-blanco-letras-tinogasta):

> Te paso dos imágenes. La primera es el taller: usá ese mismo lugar como escenario, con la mesa de madera, los estantes con productos, la pared de adobe, la ventana con los cerros y la misma luz cálida. La segunda es la remera que se entrega: una remera blanca con el estampado de las letras TINOGASTA al atardecer, que tiene que verse igual. Generá una imagen horizontal en formato 16:9 (1600 x 900 píxeles), una foto realista como tomada con cámara profesional, de una clienta retirando su pedido en el taller. Es una mujer joven ficticia, de unos 25 años, de rasgos latinoamericanos, con ropa casual, sonriendo con naturalidad, parada frente a la mesa de trabajo. Está recibiendo la remera, que sostiene abierta con las dos manos para mirar el estampado, mientras desde el borde de la foto aparecen solo las manos de la persona del local entregándosela. Se ve bien el estampado de la remera. La escena es cálida, espontánea y cercana, como una foto real de un emprendimiento local. No tiene que parecerse a ninguna persona real ni famosa. MUY IMPORTANTE: nada puede tener marcas, logos ni textos legibles, salvo el estampado de la remera. La imagen final tiene que ser horizontal, en formato 16:9.

### N.° 58 y 59 · Imagen para compartir

| Campo | Contenido |
| --- | --- |
| Archivos | compartir-og (1200 × 630) y compartir-seccion (16:9) |
| Descripción | La taza negra «Ruta del Adobe», un termo verde, una remera doblada y una gorra negra sobre una mesa rústica al aire libre, con los cerros de Tinogasta al atardecer. La mitad izquierda queda libre para poner texto encima. |
| Herramienta y fecha | Gemini, 28/10/2026. |
| Prompt final | Ver abajo (el del tercer intento). |
| Intentos | 3. En el primero los productos parecían pegados y la remera estaba parada. En el segundo, la corrección en el mismo chat devolvió la misma imagen. En el tercero abrí un chat nuevo y pedí todo desde el principio. Referencias: las cuatro fotos de productos. |
| Edición humana | Recorte a 1200 × 630 con una leve ampliación y otro recorte a 16:9, los dos en WebP. Se aceptaron dos detalles: el termo salió grande y con la tapa alargada, y las letras de la remera algo raras. |
| Uso | Imagen que aparece al compartir el link del sitio por WhatsApp o redes (Open Graph) y en la portada. |
| Leyenda | «Imagen ilustrativa generada con IA (Gemini). Productos de Sean's Store ambientados en los cerros de Tinogasta.» |

**Prompt final** (tercer intento, en un chat nuevo, adjuntando taza-ceramica-negro-iglesia-adobe, termo-verde-claro-iglesia-adobe, remera-blanco-letras-tinogasta y gorra-negro-iglesia-adobe):

> Te paso cuatro imágenes de productos: una taza negra, un termo verde claro con tapa redondeada tipo cúpula, una remera blanca y una gorra negra, cada uno con su estampado. Usalos tal cual, con los mismos diseños y el mismo modelo, sin inventar nada. Generá una foto realista, horizontal en formato 16:9, como tomada con cámara profesional al atardecer. Es una mesa rústica de madera al aire libre, con los cerros rojizos y áridos de Tinogasta, Catamarca, desenfocados al fondo y el cielo naranja y violeta. El sol está bajo, detrás de los productos, así que cada producto tiene un borde de luz dorada en el contorno y proyecta una sombra larga y suave sobre la madera, hacia la cámara. Sobre la mitad DERECHA de la mesa están los productos: la taza, el termo parado, la gorra apoyada, y la remera doblada y ACOSTADA plana sobre la mesa con el estampado hacia arriba. Todo tiene que verse apoyado de verdad, con contacto y sombra, no pegado. La mitad IZQUIERDA queda libre, solo con la mesa y el paisaje. MUY IMPORTANTE: no agregues ningún texto, marca ni logo, salvo los estampados de los productos. La imagen final tiene que ser horizontal, en formato 16:9.

### N.° 60 y 61 · Mockups en notebook

| Campo | Contenido |
| --- | --- |
| Archivos | mockup-notebook (portada) y mockup-notebook-catalogo (catálogo) |
| Descripción | Una notebook gris sin marca, casi de frente, sobre la mesa del taller, con una remera doblada, una planta y la taza blanca «Atardecer en Tinogasta» de la tienda. |
| Herramienta y fecha | Gemini, 28/10/2026. |
| Prompt final | Ver abajo (prompt inicial y corrección). |
| Intentos | 2. En el primero la taza era una cualquiera; adjunté la foto de la taza blanca de la tienda y se reemplazó en el mismo chat. Referencia: la foto del taller. |
| Edición humana | Gemini generó la notebook con la **pantalla en blanco**. Después Claude pegó una **captura real** del sitio con la perspectiva de la pantalla: la portada en uno y el catálogo en el otro. La imagen se amplió al doble (2048 × 1144) para que el sitio se lea nítido. De la captura se recortaron la barra de tareas y la barra de desplazamiento, y los botones flotantes se reubicaron en las esquinas porque quedaban afuera. |
| Uso | Informe y presentación. |
| Leyenda | «Mockup generado con IA (Gemini); la pantalla muestra una captura real del sitio de Sean's Store.» |
| Nota | En la captura del catálogo la taza de polímero todavía aparece sin foto. Cuando tenga sus fotos, conviene rehacer ese mockup. |

**Prompt inicial** (chat nuevo, adjuntando nuestro-taller):

> Usá la imagen adjunta como referencia del lugar: el mismo taller, con la mesa de madera, la pared de adobe, los estantes y la ventana con los cerros rojizos, con la misma luz cálida. Generá una foto realista horizontal en formato 16:9, como tomada con cámara profesional, de una notebook abierta apoyada sobre la mesa de madera del taller. La notebook es moderna, de color gris plateado y SIN ningún logo ni marca, y está casi de frente a la cámara, apenas girada, con la pantalla bien visible y ocupando buena parte del centro de la imagen. La pantalla está encendida y es completamente BLANCA y lisa, sin ningún contenido, ícono ni texto, y con los bordes negros finos bien definidos. Alrededor de la notebook hay una taza de cerámica con estampado, una remera doblada y una planta chica en maceta de barro. El fondo, con los estantes y la ventana con los cerros, está desenfocado. No hay personas. MUY IMPORTANTE: nada puede tener marcas, logos ni textos legibles. La imagen final tiene que ser horizontal, en formato 16:9.

**Corrección final** (mismo chat, adjuntando taza-ceramica-blanco-iglesia-reloj):

> Mantené exactamente la misma imagen: la notebook con la pantalla blanca, la mesa, la remera, la planta, el taller, la ventana y la luz, todo en el mismo lugar. Solo reemplazá la taza que está a la izquierda de la notebook por la taza de la imagen adjunta, tal cual: el mismo modelo, el mismo estampado de la iglesia del reloj al atardecer y el texto “Atardecer en Tinogasta”. Tiene que tener el mismo tamaño y la misma posición que la taza actual, apoyada sobre la mesa con su sombra. La pantalla de la notebook sigue completamente blanca. La imagen final tiene que ser horizontal, en formato 16:9.

### N.° 62 y 63 · Mockups en celular

| Campo | Contenido |
| --- | --- |
| Archivos | mockup-celular-sitio (portada) y mockup-celular-catalogo (catálogo) |
| Descripción | Una mano ficticia sostiene un celular negro sin marca, en vertical, con el taller desenfocado de fondo. |
| Herramienta y fecha | Gemini, 28/10/2026. |
| Prompt final | Ver abajo. |
| Intentos | 1, en un chat nuevo. Referencia: la foto del taller. |
| Edición humana | Gemini generó el celular con la **pantalla en blanco**. Saqué capturas reales desde mi celular (se ve la dirección sean-store.vercel.app) y Claude las pegó en la pantalla respetando las esquinas redondeadas. Imagen ampliada al doble (2048 × 1144). |
| Uso | Informe y presentación. |
| Leyenda | «Mockup generado con IA (Gemini); la pantalla muestra una captura real del sitio de Sean's Store.» |
| Nota | En la captura del catálogo la taza de polímero todavía aparece sin foto. |

**Prompt final** (adjuntando nuestro-taller):

> Usá la imagen adjunta solo como referencia del fondo: el mismo taller con la pared de adobe, los estantes con productos y la ventana con los cerros rojizos, con la misma luz cálida. Generá una foto realista horizontal en formato 16:9, como tomada con cámara profesional, de una mano sosteniendo un celular en primer plano. La mano es de una persona ficticia, natural, sin anillos llamativos, y solo se ve la mano y parte de la muñeca, sin cara. El celular es moderno, negro, con bordes finos, SIN ningún logo ni marca, y está en posición vertical, casi de frente a la cámara, ubicado un poco a la derecha del centro y ocupando buena parte del alto de la imagen. La pantalla está encendida y es completamente BLANCA y lisa, sin ningún contenido, ícono, hora ni texto, con los bordes bien definidos. El fondo del taller está bien desenfocado. MUY IMPORTANTE: nada puede tener marcas, logos ni textos legibles. La imagen final tiene que ser horizontal, en formato 16:9.

---

## Resumen

| Grupo | Piezas aprobadas | Intentos registrados | Con edición humana además del WebP |
| --- | --- | --- | --- |
| Productos | 55 | al menos 85 generaciones | Taza blanca (recorte), 3 gorras (recorte), llavero de acrílico (diseño aplicado aparte), 6 almohadones (texto centrado) |
| Consigna 4.1 | 8 | 8 | Todas con recorte; los 4 mockups con la captura real del sitio pegada en la pantalla (la captura no la hizo Gemini) |
| **Total** | **63** | | |

**Pendientes de este archivo:**
- Las fotos de la taza de polímero, cuando se hagan.
- Resolver la foto de referencia de @facundo_carrizo24.
