# IDEAS — LifeRPG

Registro de ideas para que no se pierdan. **No significa que las vamos a hacer ya.**
Cada idea se prioriza cuando llegue su horizonte.

---

## 🟢 Horizonte 1 — Núcleo (EN PROGRESO)

- [ ] Contable con Supabase
- [ ] Inventario con durabilidad
- [ ] Misiones básicas
- [ ] Gamificación (XP, nivel, racha)

---

## 🟡 Horizonte 2 — Identidad

### Estética
- [ ] Modo claro opcional
- [ ] Colores por categoría
- [ ] Animaciones al ganar XP (+50 XP flotante)
- [ ] Sonidos 8-bit
- [ ] Pantalla de "subiste de nivel"
- [ ] Iconos pixel art propios (reemplazar emojis)
- [ ] Tema visual cambiable por estación/evento

### Avatar y personaje
- [ ] Avatar personalizable estilo Craft Warriors
- [ ] Mascota / personaje que evoluciona con tu progreso
- [ ] Rival fantasma (NPC con el que competís)

### Experiencia
- [ ] Onboarding / tutorial con NPC
- [ ] Vista "resumen del día" al abrir
- [ ] Vista "resumen semanal" los domingos
- [ ] Modo rápido para registrar gastos
- [ ] PWA instalable
- [ ] Notificaciones push

---

## 🔴 Horizonte 3 — Magia

### Mapa y memoria
- [ ] Mapa interactivo de lugares visitados
- [ ] Fotos geolocalizadas
- [ ] Recuerdos guardados por ubicación
- [ ] Recordatorio al llegar a un lugar ("acá compraste X", "acá comiste Y")
- [ ] Diario visual por lugar

### Realidad aumentada
- [ ] QR/NFC en cajones → ver contenido sin abrir
- [ ] QR/NFC en nevera → ver inventario
- [ ] Tableros AR en espacios físicos
- [ ] Cámara integrada

---

## ⚫ Horizonte 4 — Juegos y social

- [ ] Juegos simples dentro de la app
- [ ] Juegos de mesa para jugar con amigos en reuniones
- [ ] Tableros AR para juegos
- [ ] Salas / lobbies multijugador
- [ ] Chat entre usuarios
- [ ] Sistema de invitaciones

---

## 💭 Ideas sueltas / "algún día"

- [ ] Integración bancaria (si hay API disponible)
- [ ] Múltiples usuarios (pareja, familia) — gastos compartidos
- [ ] Modo "viaje" (inventario y gastos separados)
- [ ] Mercado entre usuarios
- [ ] Exportar a PDF/CSV
- [ ] App móvil nativa
- [ ] Integración con calendario
- [ ] Scraping de precios
- [ ] Asistente IA
- [ ] Adjuntar fotos de tickets
- [ ] Transacciones divididas
- [ ] Tags libres (#regalo, #trabajo, #emergencia)
- [ ] Método de pago por transacción
- [ ] Deudas (lo que te deben y lo que debés)
- [ ] Metas de ahorro
- [ ] Modo "sálvese quien pueda" (qué tirar)
- [ ] Costo por uso de un item

## 💭 Pendientes técnicos / "algún día"

- [ ] Comprar dominio propio (~$10/año)
- [ ] Configurar Resend con dominio verificado
- [ ] Migrar SMTP de Supabase a Resend
- [ ] Personalizar email de confirmación con HTML pergamino
- [ ] Personalizar email de recuperación de contraseña
- [ ] Apuntar Vercel a dominio propio (en vez de liferpg-navy.vercel.app)

---

## 🔴 HORIZONTE 4 — Sistema de Combate y Aventura

> Sistema RPG donde tus acciones físicas reales (ejercicio) derrotan monstruos.
> El personaje NO sube stats ficticias: **vos subís en la vida real**.
> Inspirado en Goblin Slayer: fallar es fallar, sin concesiones.

### 📚 Concepto central

- Cada sesión de entrenamiento es **una pelea** que te exige ejercicios específicos en tiempo límite.
- Cada serie completada resta HP al monstruo.
- Cada serie fallida resta HP a tu personaje.
- Perder toda tu vida = fallar la aventura.
- Llevar la vida del monstruo a 0 = ganar.
- **No se enfrenta día a día:** es una sola pelea que se gana o se pierde.
- **No hay subida de stats de personaje.** La estadística que sube es **tu capacidad física real**.
- Con el tiempo, por pura condición física, podés enfrentar monstruos más fuertes.

### 🎯 Sistema de rondas y ejercicios

- **Rondas realistas según el monstruo:** si el monstruo es ágil, la pelea exige piernas. Si es pesado, exige fuerza.
- **El tiempo es parte del ejercicio:** cada ronda tiene tiempo límite. El monstruo no espera.
- **Fallar es fallar:** binario. Sin grises, sin premios por intentar.
- **Tipo de ronda:**
  - Por reps (ej: 20 flexiones)
  - Por tiempo (ej: plancha 60s)
  - Combinadas (ej: 20 flexiones en 40 segundos)

### 🐉 Monstruos y bestiario

- **Bestiario:** catálogo de monstruos con HP, nombre, ícono pixel art, nivel de dificultad.
- No hay un catálogo infinito: unos cuantos monstruos, con identidad propia.
- Cada monstruo tiene un "tipo" de entrenamiento asociado.

### 🏛️ Gremio de Aventureros (Misiones)

- **Tablero tipo taberna:** misiones disponibles, aceptadas, completadas.
- **Las misiones son el contenedor de las peleas:** una misión te lleva a una pelea.
- **La pelea está dentro de la misión.**
- **El siguiente monstruo depende de la misión, no de un catálogo suelto.**
- **Tipos de misión:**
  - Rutina (recurrente)
  - Proyecto (una vez, con fin)
  - Épica (con narrativa y combate)
  - Todas las combinaciones

### 🗺️ Exploración

- **La misión te lleva a un mini juego de exploración.**
- Al final del recorrido, te arroja al monstruo como un encuentro.
- No es solo "peleas al monstruo": hay un camino narrativo antes.

### ⏱️ Registro de combate

- **Con cronómetro:** arranca cuando empezás la ronda.
- Si el tiempo termina antes de que aprietes "completado", se da por fallido.
- Podés marcar serie como completada o fallida.
- Fallar una ronda resta HP a tu personaje.

### 💀 Sistema de fatiga (anti-sobreentrenamiento)

- **Consecuencia de perder:** al día siguiente tu salud inicia **un poco más baja**.
- Es una **fatiga** que evita que el usuario se lastime yendo hasta el límite muchos días seguidos.
- **Con menos vida, la tolerancia del sistema a los fallos es menor.**
- Llegás al game over más pronto → estresás menos el cuerpo.
- **Mecánica de diseño conductual:** el sistema te cuida sin sermones, con reglas del juego.

### 🏆 Recompensas

- **XP** por vencer monstruos, cumplir misiones.
- **Oro del Aventurero** (moneda separada del XP) para la Tienda.
- **Logros** al cumplir hitos.
- **Desbloqueos:** nuevas misiones, nuevos monstruos, contenido.

### 🛒 Tienda del Aventurero

- Convertís **oro** en **recompensas reales** que vos definís.
- Ejemplos: "una tarde de videojuegos", "pedir delivery", "comprar un libro".
- Vos definís el costo en oro de cada recompensa.
- **Cierra el ciclo motivacional:** acción real → XP → oro → recompensa real.

### 🎮 Sistema de XP y niveles

- **Feedback visual inmediato:**
  - Popup "+50 XP" flotante
  - Sonido 8-bit
  - Animación de barra
  - Flash dorado
- **Logros / Achievements:** galería de trofeos con íconos pixel art.
- **Rachas:** días seguidos cumpliendo misiones.
- **Norte lejano:** avatar que evoluciona con el progreso.

### 📋 Decisiones ya tomadas

- **Rondas:** definidas de forma realista por tipo de monstruo.
- **Tiempo:** parte obligatoria de cada ronda.
- **Fallo:** binario, sin premios por intentar.
- **Misiones:** contienen las peleas, no son peleas sueltas.
- **Siguiente monstruo:** depende de la misión, no de un catálogo.
- **Creación de misiones:** manual + plantillas.
- **Tipos de misión:** rutina + proyecto + épica + todas.
- **Registro de cumplimiento:** click simple (por ahora).
- **Vista del gremio:** tablero tipo taberna.
- **Monstruos:** unos cuantos, en un bestiario.
- **Encuentro:** la misión lleva a mini juego de exploración → monstruo.
- **Registro de combate:** cronómetro obligatorio.
- **Pelea perdida:** la misión se marca como fallida.
- **Fatiga:** al día siguiente, salud inicial más baja. Menos tolerancia a fallos.
- **Consecuencias fuera del combate:** solo el registro del fallo, sin penalización de XP/oro (por ahora).

### ❓ Decisiones pendientes

- ¿Quién diseña los monstruos? (manual / plantillas / híbrido)
- ¿Cómo se ve exactamente el bestiario?
- ¿Qué pasa si perdés una pelea? ¿Podés reintentar? ¿El monstruo se regenera?
- ¿La fatiga acumulada dura un día o más?
- ¿Cómo se registra el ejercicio exactamente? ¿Cronómetro visible? ¿Pausable?
- ¿Hay combate en tiempo real o es por rondas discretas?
- ¿El mini juego de exploración es texto, imagen, mapa?

### 🚧 Estado

**Borrador de diseño.** No se implementa todavía.
Es el **Horizonte 4**. Se construye después de:
- Horizonte 1 (núcleo: cofres, transacciones) ✅
- Horizonte 2 (identidad: avatar, estética avanzada)
- Horizonte 3 (magia: mapa, AR, memoria geolocalizada)

Y **después de las fases previas del sistema de aventura:**
- Fase 2: Gremio de Aventureros (misiones sin monstruos)
- Fase 3: Sistema de Recompensas (tienda + oro)
- Fase 4: Combate y monstruos ← acá va este módulo