# Control de Fichas SENA

Aplicación web para administrar programas de formación, planes, competencias, instructores, fichas, programación académica, novedades y prórrogas.

El sistema reemplaza el seguimiento manual realizado en hojas de cálculo por un flujo centralizado, con autenticación, historial y validaciones de horario y horas programadas.

## Contenido

- [Funciones principales](#funciones-principales)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación local](#instalación-local)
- [Primera configuración](#primera-configuración)
- [Manual de usuario](#manual-de-usuario)
- [Reglas principales](#reglas-principales)
- [Comandos disponibles](#comandos-disponibles)
- [Base de datos y migraciones](#base-de-datos-y-migraciones)
- [Despliegue con Vercel y Neon](#despliegue-con-vercel-y-neon)
- [Pruebas y calidad](#pruebas-y-calidad)
- [Solución de problemas](#solución-de-problemas)
- [Seguridad](#seguridad)

## Funciones principales

- Inicio de sesión mediante correo institucional y contraseña.
- Creación segura de la primera cuenta del instructor líder.
- Administración de programas, versiones de planes y competencias.
- Administración de instructores activos e inactivos.
- Creación y seguimiento de fichas de formación.
- Asignación histórica del instructor líder de cada ficha.
- Programación de competencias por instructor, fechas y bloques semanales.
- Control automático de horas programadas, pendientes y finalizadas.
- Registro de novedades sobre cada competencia.
- Solicitud, aprobación y rechazo de prórrogas.
- Actualización automática de fechas al aprobar una prórroga.
- Dashboard general con el estado de las fichas y sus competencias.
- Interfaz responsive y modo oscuro.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Framework | Next.js 16.3 con App Router y Server Actions |
| Interfaz | React 19.2 |
| Lenguaje | TypeScript 5 en modo estricto |
| Estilos | Tailwind CSS 4 |
| Base de datos | PostgreSQL |
| ORM | Prisma ORM 7.9 |
| Adaptador PostgreSQL | `@prisma/adapter-pg` y `pg` |
| Autenticación | Auth.js / NextAuth 5 con JWT y Credentials |
| Validaciones | Zod 4 |
| Pruebas | Vitest 4 |
| Calidad | ESLint 9 |
| Despliegue recomendado | Vercel + Neon PostgreSQL |

> Aunque la idea inicial contemplaba Next.js 15, el proyecto actualmente utiliza Next.js 16.3. Los comandos y convenciones de este documento corresponden a la versión instalada.

## Arquitectura

El proyecto utiliza una arquitectura **Feature First**. Cada dominio mantiene sus componentes, acciones, servicios, validadores, tipos y utilidades separados.

```text
app/                    Rutas, páginas, layouts y endpoints de Next.js
components/             Componentes compartidos de interfaz y layout
config/                 Configuración centralizada de navegación
lib/                    Autenticación, Prisma y utilidades de infraestructura
modules/
  auth/                 Configuración inicial e inicio de sesión
  programas/            Programas, planes y competencias
  instructores/         Gestión de instructores
  fichas/                Fichas, seguimientos, horarios y novedades
  prorrogas/             Solicitudes y resolución de prórrogas
  dashboard/             Vista consolidada de seguimiento
prisma/
  schema.prisma          Modelo de datos
  migrations/            Migraciones versionadas
shared/                  Tipos, constantes, validadores y utilidades globales
proxy.ts                 Protección centralizada de rutas
prisma.config.ts         Configuración de Prisma
```

Principios utilizados:

- Los componentes no acceden directamente a Prisma.
- Las Server Actions validan la entrada y llaman a servicios.
- Los servicios concentran las reglas de negocio.
- Los adaptadores de persistencia aíslan las consultas a PostgreSQL.
- Los tipos y validadores reutilizables evitan duplicación.
- Las rutas protegidas requieren una sesión válida.

## Requisitos

Antes de instalar el proyecto se necesita:

- Node.js 22 LTS recomendado. Mínimo compatible: Node.js 20.19.
- npm, incluido con Node.js.
- PostgreSQL 16 o superior. El proyecto también ha sido probado con PostgreSQL 18.
- Git.

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/JoseAlMunozM/control_fichas_sena.git
cd control_fichas_sena
```

### 2. Instalar dependencias

```bash
npm install
```

La instalación ejecuta `prisma generate` automáticamente mediante el script `postinstall`.

### 3. Crear una base de datos vacía

Puede crearse desde pgAdmin o desde PostgreSQL:

```sql
CREATE DATABASE control_fichas;
```

No es necesario registrar datos manualmente ni ejecutar un archivo seed. La aplicación inicia con las tablas vacías.

### 4. Crear el archivo de entorno

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Configure las variables de `.env`:

```env
DATABASE_URL="postgresql://postgres:CONTRASENA@localhost:5432/control_fichas?schema=public"
AUTH_SECRET="SECRETO_ALEATORIO_SEGURO"
AUTH_TRUST_HOST="true"
DEV_AUTH_BYPASS="false"
```

Si PostgreSQL utiliza otro puerto, reemplácelo en `DATABASE_URL`. Por ejemplo, una instalación local en el puerto 5433 usaría:

```env
DATABASE_URL="postgresql://postgres:CONTRASENA@localhost:5433/control_fichas?schema=public"
```

Para generar un `AUTH_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Si la contraseña de PostgreSQL contiene caracteres especiales, debe codificarse para que sea válida dentro de una URL.

### 5. Crear las tablas

```bash
npx prisma migrate deploy
```

Este comando aplica las migraciones existentes sin cargar información de ejemplo.

### 6. Ejecutar el proyecto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) en el navegador.

### 7. Probar una compilación de producción

```bash
npm run build
npm start
```

## Primera configuración

Cuando la base de datos no tiene usuarios, la aplicación redirige automáticamente a `/setup`.

1. Ingrese el nombre completo del instructor líder.
2. Ingrese su correo institucional; este será su usuario para iniciar sesión.
3. Cree una contraseña de mínimo 10 caracteres, con mayúscula, minúscula y número.
4. Confirme la contraseña.
5. Seleccione **Crear cuenta inicial**.

La operación crea:

- La primera cuenta administrativa.
- El instructor vinculado a esa cuenta.
- La sesión inicial del sistema.

Después de crear el primer usuario, `/setup` deja de estar disponible. Los siguientes accesos se realizan desde `/login`.

El proyecto no incluye usuarios ni contraseñas predeterminadas.

## Manual de usuario

### Orden recomendado de configuración

Para comenzar con una base de datos vacía, siga este orden:

1. Crear la cuenta inicial.
2. Registrar los instructores.
3. Crear un programa.
4. Crear una versión del plan.
5. Agregar las competencias y sus horas.
6. Activar la versión del plan.
7. Crear una ficha usando ese plan.
8. Programar las competencias de la ficha.
9. Registrar novedades o prórrogas cuando sean necesarias.
10. Consultar el avance desde el dashboard.

### Navegación general

La aplicación dispone de un menú lateral con las vistas habilitadas, un encabezado con la sesión actual, breadcrumb, pie de página y selector de tema.

- Use el menú lateral para cambiar de módulo.
- Use el breadcrumb para reconocer la ubicación actual.
- Use el selector de tema para cambiar entre modo claro y oscuro.
- Use **Salir** para cerrar la sesión.

### Programas

La vista **Programas** permite buscar, filtrar, crear, editar y eliminar programas.

Cada programa contiene:

- Código único.
- Nombre.
- Descripción.
- Estado activo o inactivo.
- Una o varias versiones de plan.

Desde **Plan y competencias** se administran las versiones del plan y sus competencias.

#### Versiones del plan

Un programa puede conservar varias versiones para mantener su histórico. Cada ficha se asocia a una versión concreta.

Antes de crear una ficha:

1. Cree la versión del plan.
2. Agregue todas sus competencias.
3. Verifique las horas y el orden.
4. Active la versión que se utilizará.

#### Competencias del plan

Cada competencia incluye:

- Nombre corto.
- Norma o descripción.
- Tipo: técnica, transversal o práctica.
- Horas del plan.
- Orden dentro del plan.

Las competencias pueden agregarse, editarse, eliminarse y ordenarse mientras el plan lo permita.

> Al crear una ficha, sus competencias se copian desde la versión seleccionada. Los cambios posteriores al plan no modifican automáticamente las fichas ya creadas.

### Instructores

La vista **Instructores** permite crear, buscar, editar, activar e inactivar instructores.

Datos disponibles:

- Nombre completo.
- Correo institucional único.
- Teléfono opcional.
- Estado.
- Observaciones.

Solo los instructores activos pueden seleccionarse para nuevas asignaciones. Inactivar un instructor no elimina su participación histórica.

### Fichas

La vista **Fichas** permite crear y consultar fichas de formación.

Para crear una ficha se registra:

- Número único de ficha.
- Programa.
- Versión activa del plan.
- Municipio y sede.
- Modalidad.
- Días de formación.
- Jornada permitida por día.
- Fecha de inicio.
- Fin de etapa lectiva.
- Fin de etapa práctica.
- Observaciones.

La ficha recibe inicialmente como líder al instructor asociado con la cuenta autenticada. Este liderazgo puede cambiarse posteriormente sin perder el histórico.

#### Detalle de una ficha

La vista de detalle muestra:

- Información general y líder vigente.
- Historial de líderes.
- Ubicación y modalidad.
- Jornada permitida.
- Fechas vigentes.
- Cantidad de competencias.
- Total de horas del plan.
- Competencias finalizadas.
- Seguimiento individual de competencias.

#### Estados de una ficha

- Planeada.
- En formación.
- Etapa práctica.
- Finalizada.
- Cancelada.

### Cambio de instructor líder

Una ficha tiene un único instructor líder vigente, pero conserva todos sus líderes anteriores.

Al realizar el cambio se registra:

- Nuevo instructor líder.
- Fecha efectiva.
- Motivo del cambio.
- Fecha de finalización del liderazgo anterior.

El histórico permite conservar la trazabilidad cuando un instructor es reemplazado, cambia de responsabilidad o deja la organización.

### Seguimiento y programación de competencias

Seleccione **Administrar** en una competencia de la ficha para consultar o modificar su programación.

Cada seguimiento permite:

- Cambiar el estado de la competencia.
- Agregar uno o varios segmentos de programación.
- Seleccionar el instructor que dicta la competencia.
- Definir un intervalo de fechas.
- Definir uno o varios bloques semanales.
- Editar o eliminar segmentos.
- Consultar horas programadas y pendientes.
- Registrar novedades.

Una competencia puede tener varios segmentos y varios instructores. El instructor líder también puede dictar competencias, pero ser líder no lo convierte automáticamente en el instructor de todas ellas.

#### Ejemplo de programación

Una competencia de 15 horas puede programarse así:

```text
Fecha inicial: 28/07/2025
Fecha final:   30/07/2025
Lunes:         07:00–13:00  (6 horas)
Martes:        07:00–13:00  (6 horas)
Miércoles:     07:00–10:00  (3 horas)
Total:                         15 horas
```

También pueden dictarse dos competencias el mismo día, por ejemplo de 07:00 a 09:00 y de 09:00 a 12:00, siempre que sus horarios no se superpongan.

#### Estados de una competencia

- Pendiente.
- Programada.
- En ejecución.
- Finalizada.
- Suspendida.
- Cancelada.

Para pasar una competencia a **Programada** o **En ejecución**, debe existir al menos un segmento de programación.

Para pasarla a **Finalizada**, las horas programadas deben ser exactamente iguales a las horas del plan. Si el plan indica 15 horas, no se permite finalizar con 14 ni con 16.

### Novedades

Las novedades conservan hechos importantes relacionados con una competencia:

- Observación.
- Reprogramación.
- Cambio de instructor.
- Suspensión.
- Otra novedad.

Cada registro conserva el tipo, la descripción, la fecha y el usuario responsable.

### Prórrogas

La vista **Prórrogas** permite solicitar cambios en las fechas de una ficha.

Una solicitud contiene:

- Ficha relacionada.
- Nueva fecha de fin lectivo.
- Nueva fecha de fin práctico.
- Motivo.
- Estado.
- Respuesta u observación de resolución.

Estados disponibles:

- Pendiente.
- Aprobada.
- Rechazada.

Solo una prórroga pendiente puede editarse, eliminarse, aprobarse o rechazarse. Al aprobarla, las nuevas fechas se aplican automáticamente a la ficha y la solicitud permanece como histórico.

### Dashboard

El dashboard consolida el estado general de las fichas y competencias. Permite revisar, entre otros datos:

- Programa y ficha.
- Instructor líder.
- Ubicación y fechas.
- Competencia y estado.
- Horas del plan, programadas y pendientes.
- Instructor asignado y bloques de horario.
- Cantidad de novedades.
- Información de la última prórroga.

Use esta vista para detectar competencias sin programar, horas pendientes y avances del proceso formativo.

## Reglas principales

### Horarios

- Toda programación debe respetar los días y la jornada definidos en la ficha.
- Un mismo espacio horario de una ficha no puede asignarse a dos competencias.
- Un instructor no puede tener horarios superpuestos entre fichas diferentes.
- Dos competencias pueden dictarse el mismo día si sus bloques no se superponen.
- Una competencia puede dividirse en varios segmentos.

### Fechas

- Las competencias técnicas y transversales deben programarse dentro de la etapa lectiva.
- Las competencias prácticas pueden extenderse hasta el fin de la etapa práctica.
- Las prórrogas aprobadas actualizan las fechas vigentes de la ficha.

### Horas

- Las horas del seguimiento provienen de las horas definidas en el plan.
- El sistema calcula las horas de cada segmento según sus fechas y recurrencia semanal.
- No se permite programar más horas que las definidas en el plan.
- Solo se permite finalizar una competencia cuando las horas programadas coinciden exactamente con las horas del plan.

### Histórico

- Los cambios de instructor líder no eliminan asignaciones anteriores.
- Las prórrogas resueltas permanecen registradas.
- Las novedades conservan la trazabilidad de eventos relevantes.
- Inactivar un instructor no borra sus asignaciones históricas.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm start` | Inicia una compilación ya generada |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta las pruebas unitarias una vez |
| `npm run test:watch` | Ejecuta Vitest en modo observación |
| `npm run prisma:generate` | Regenera Prisma Client |
| `npm run prisma:validate` | Valida el esquema de Prisma |
| `npm run prisma:migrate -- --name nombre` | Crea y aplica una migración de desarrollo |
| `npm run vercel-build` | Genera Prisma, aplica migraciones y compila para Vercel |

## Base de datos y migraciones

El modelo de datos está definido en `prisma/schema.prisma` y las migraciones se encuentran en `prisma/migrations`.

### Aplicar migraciones existentes

Use este comando al instalar el proyecto o actualizar un entorno:

```bash
npx prisma migrate deploy
```

### Crear una migración durante el desarrollo

Después de modificar `prisma/schema.prisma`:

```bash
npm run prisma:migrate -- --name descripcion_del_cambio
```

Luego verifique:

```bash
npm run prisma:validate
npm run build
```

Recomendaciones:

- Versione las migraciones en Git.
- No edite una migración que ya fue aplicada en producción.
- No use `prisma db push` como reemplazo de las migraciones de producción.
- Realice una copia de seguridad antes de cambios importantes.
- No agregue credenciales ni datos sensibles al repositorio.

## Despliegue con Vercel y Neon

La combinación recomendada para producción es Vercel para Next.js y Neon para PostgreSQL.

### 1. Crear la base de datos en Neon

1. Cree un proyecto en Neon.
2. Seleccione la región más cercana a los usuarios. Para Colombia, São Paulo suele ser una opción adecuada entre las regiones disponibles.
3. Copie la cadena de conexión con pooling y SSL.

Ejemplo de formato:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@HOST-POOLER/BASE?sslmode=require"
```

### 2. Importar el repositorio en Vercel

1. Conecte la cuenta de GitHub con Vercel.
2. Importe el repositorio.
3. Mantenga el framework detectado como Next.js.
4. Verifique que el directorio raíz sea la raíz del repositorio.

### 3. Configurar variables de entorno

Agregue en Vercel:

```env
DATABASE_URL="CONEXION_DE_NEON"
AUTH_SECRET="SECRETO_ALEATORIO_SEGURO"
AUTH_TRUST_HOST="true"
DEV_AUTH_BYPASS="false"
```

No reutilice un secreto publicado ni copie el archivo `.env` al repositorio.

### 4. Desplegar

Vercel ejecuta el script `vercel-build`, que realiza:

```text
prisma generate
prisma migrate deploy
next build
```

Después del primer despliegue, visite la URL pública. Si la base está vacía, aparecerá la pantalla de configuración inicial.

> Evite conectar despliegues Preview a la base de producción. Use otra rama o base de Neon para pruebas cuando sea necesario.

## Pruebas y calidad

Antes de subir cambios importantes ejecute:

```bash
npm run lint
npm test
npm run build
```

Las pruebas unitarias cubren reglas y servicios principales de programas, fichas, instructores, prórrogas y dashboard. El proyecto no incluye pruebas E2E ni una suite de integración completa.

## Solución de problemas

### La aplicación no conecta con PostgreSQL

- Verifique que PostgreSQL esté iniciado.
- Revise host, puerto, usuario, contraseña y nombre de base en `DATABASE_URL`.
- Confirme que la base exista.
- Ejecute `npx prisma migrate deploy`.

### Prisma no encuentra cambios o tipos actualizados

```bash
npm run prisma:generate
```

Reinicie después el servidor de desarrollo.

### No aparece la configuración inicial

La ruta `/setup` solo está disponible cuando no existe ningún usuario. Si ya se creó uno, use `/login`.

### No puedo finalizar una competencia

Compruebe que:

- Exista al menos una programación.
- Las horas programadas sean exactamente iguales a las horas del plan.
- No haya bloques inválidos o fuera de la jornada de la ficha.

### Aparece un conflicto de horario

Revise que el bloque no se superponga con:

- Otra competencia dentro de la misma ficha.
- Otra ficha asignada al mismo instructor.

### Agregué una competencia al plan y no aparece en una ficha existente

Es el comportamiento esperado. La ficha conserva una copia de las competencias existentes al momento de su creación. El cambio sí aplicará a nuevas fichas creadas con esa versión.

### El build detecta una raíz incorrecta de Turbopack

Ejecute los comandos desde la carpeta raíz del repositorio, donde se encuentran `package.json` y `next.config.ts`. La configuración del proyecto ya define la raíz de Turbopack.

## Seguridad

- Nunca publique `.env`, contraseñas ni cadenas de conexión.
- Mantenga `DEV_AUTH_BYPASS=false`, especialmente en producción.
- Use contraseñas únicas y seguras.
- Genere un `AUTH_SECRET` diferente por entorno.
- Limite el acceso al proyecto de Neon y a las variables de Vercel.
- Realice copias de seguridad periódicas de la base de datos.
- Cierre la sesión al utilizar equipos compartidos.

---

El sistema se entrega sin información precargada para que cada entorno construya su propio catálogo de programas, instructores, fichas y seguimientos.
