# Manual de usuario — Control de Fichas SENA

**Versión del manual:** 1.0  
**Fecha de actualización:** 15 de agosto de 2026  
**Perfil autorizado:** Instructor líder responsable del control y seguimiento
## 1. Propósito del sistema

Control de Fichas SENA reemplaza el seguimiento manual realizado en hojas de cálculo. Permite mantener en un solo lugar:

- Programas de formación.
- Versiones de los planes y sus competencias.
- Instructores y su histórico de contratos.
- Fichas, jornadas y fechas de formación.
- Instructor líder actual e histórico de líderes.
- Programaciones por competencia, instructor y horario.
- Horas programadas, pendientes y finalizadas.
- Novedades académicas.
- Solicitudes e histórico de prórrogas.
- Vista general del avance de todas las fichas.

El sistema está diseñado para ser utilizado por el instructor líder encargado del control. La información registrada es compartida y se consulta desde la base de datos central; no queda guardada solamente en el computador del usuario.

## 2. Conceptos básicos
| Concepto | Significado |
| --- | --- |
| Programa | Programa de formación identificado por código y nombre. |
| Versión del plan | Versión específica del plan de formación de un programa. |
| Competencia | Componente técnico, transversal o práctico con una cantidad de horas definida. |
| Ficha | Grupo de formación asociado a un programa y a una versión del plan. |
| Jornada | Días y horarios dentro de los cuales se permite programar formación. |
| Seguimiento | Copia de una competencia dentro de una ficha, con estado, horas, programaciones y novedades propias. |
| Segmento | Programación de una competencia para un instructor, rango de fechas y bloques semanales. |
| Novedad | Registro de una observación, reprogramación, cambio de instructor, suspensión u otro evento. |
| Prórroga | Solicitud para ampliar las fechas de finalización lectiva y práctica de una ficha. |
| Instructor líder | Responsable vigente de la ficha. La ficha conserva el histórico cuando el líder cambia. |
| Contrato | Periodo durante el cual un instructor se considera activo para nuevas asignaciones. |

## 3. Recomendaciones antes de comenzar

1. Utilice preferiblemente Google Chrome, Microsoft Edge o un navegador actualizado.
2. Confirme que tiene conexión a internet antes de registrar información.
3. No abra varias pestañas para editar el mismo registro simultáneamente.
4. Espere el mensaje de confirmación o el cierre del formulario antes de abandonar una pantalla.
5. No modifique información directamente desde Neon, pgAdmin o consultas SQL. Use siempre la aplicación.
6. Evite eliminar información que ya tenga uso operativo. Prefiera inactivar, cancelar o conservar el histórico.
7. Verifique cuidadosamente fechas, horas y correo de los instructores antes de guardar.

## 4. Primer ingreso

### 4.1 Base de datos sin usuarios

Cuando el sistema se abre por primera vez y no existe ningún usuario, aparece **Configuración inicial**.

1. Escriba el nombre completo del instructor líder.
2. Escriba el correo institucional. Este correo será el usuario de acceso.
3. Cree una contraseña de mínimo 10 caracteres.
4. Incluya al menos una letra mayúscula, una minúscula y un número.
5. Repita la contraseña en **Confirmar contraseña**.
6. Seleccione **Crear cuenta inicial**.

La operación crea la primera cuenta administrativa y un instructor vinculado a ella.

> La configuración inicial solamente puede realizarse una vez. Los instructores creados posteriormente no reciben automáticamente una cuenta para iniciar sesión.

### 4.2 Inicio de sesión normal

1. Abra la dirección entregada de la aplicación.
2. En **Correo institucional**, escriba el correo de la cuenta principal.
3. Escriba la contraseña.
4. Seleccione **Ingresar**.

Si los datos son correctos, aparecerá la página **Inicio**.

### 4.3 Cerrar sesión

1. Ubique el encabezado superior.
2. Seleccione **Salir**.
3. Confirme que aparece la pantalla de inicio de sesión.

Siempre cierre la sesión si utiliza un computador compartido.

### 4.4 Contraseña olvidada

La versión actual no tiene recuperación automática de contraseña ni administración visual de usuarios. Las contraseñas se almacenan mediante un hash seguro y no se pueden leer ni desencriptar desde la base de datos.

Si se pierde la contraseña:

1. No intente modificar el valor almacenado directamente.
2. Contacte al responsable técnico indicado en la sección **Datos de entrega**.
3. Solicite un procedimiento controlado de restablecimiento.

## 5. Navegación general

Después de iniciar sesión se encuentran las siguientes opciones:

- **Inicio:** accesos rápidos a todos los módulos disponibles.
- **Dashboard:** vista consolidada del control general.
- **Fichas:** creación y administración de fichas.
- **Programas:** programas, versiones de planes y competencias.
- **Instructores:** datos de instructores y contratos.
- **Prórrogas:** solicitudes y resolución de ampliaciones de fechas.

### 5.1 Menú lateral

Seleccione el nombre o icono del módulo al que desea ingresar. En pantallas pequeñas el menú se adapta al ancho disponible.

### 5.2 Ruta de navegación

En la parte superior del contenido aparece la ubicación actual, por ejemplo:

```text
Inicio > Fichas > 3379824
```

Use estos enlaces o los botones **Volver** para regresar de forma segura.

### 5.3 Modo claro y oscuro

Use el control con los iconos de sol y luna para cambiar la apariencia. El cambio solamente afecta la visualización; no modifica los datos.

### 5.4 Tablas en pantallas pequeñas

Algunas tablas contienen muchas columnas. Si no observa las acciones o columnas finales, desplácese horizontalmente dentro de la tabla.

## 6. Orden correcto para configurar información nueva

Cuando la base está vacía o se inicia un nuevo proceso, siga este orden:

1. Crear o verificar los instructores y sus contratos.
2. Crear el programa.
3. Crear una versión del plan.
4. Agregar las competencias y sus horas.
5. Activar la versión que se utilizará.
6. Crear la ficha.
7. Verificar o cambiar el instructor líder.
8. Programar las competencias.
9. Actualizar los estados de las competencias y de la ficha.
10. Registrar novedades y prórrogas cuando corresponda.
11. Revisar el resultado en el dashboard.

No se debe crear una ficha antes de terminar el plan, porque las competencias se copian a la ficha en el momento de su creación.

## 7. Módulo Programas

### 7.1 Consultar y filtrar programas

1. Ingrese a **Programas**.
2. Use **Búsqueda general** para buscar por código, nombre o descripción.
3. También puede completar **Código**, **Nombre** o seleccionar el **Estado**.
4. Seleccione **Aplicar filtros**.
5. Use **Limpiar filtros** para volver al listado completo.

### 7.2 Crear un programa

1. Seleccione **Nuevo programa**.
2. Complete **Código**. Debe ser único.
3. Complete **Nombre**.
4. Escriba una descripción si es necesaria.
5. Seleccione **Activo** para que pueda utilizarse al crear fichas.
6. Seleccione **Crear programa**.

Si el código ya existe, el sistema no permitirá guardarlo.

### 7.3 Editar un programa

1. Busque el programa en la tabla.
2. Seleccione **Editar**.
3. Modifique los datos necesarios.
4. Seleccione **Actualizar programa**.

Use el estado **Inactivo** cuando el programa no deba utilizarse en nuevas fichas, pero su histórico deba conservarse.

### 7.4 Administrar planes y competencias

1. Busque el programa.
2. Seleccione **Plan y competencias**.
3. La pantalla mostrará el plan seleccionado, su estado, cantidad de competencias y total de horas.

### 7.5 Crear una versión del plan

1. Seleccione **Nueva versión** o **Crear primera versión**.
2. Escriba la versión, por ejemplo `V1-2026`.
3. Seleccione su estado.
4. Seleccione **Guardar plan**.

Reglas importantes:

- La versión debe ser única dentro del programa.
- Al activar una versión, las otras versiones del mismo programa quedan inactivas.
- Puede conservar varias versiones para mantener el histórico.
- La primera versión se crea activa de forma predeterminada.

### 7.6 Editar una versión

1. En **Plan de formación**, seleccione la versión.
2. Seleccione **Editar versión**.
3. Modifique el nombre o estado.
4. Seleccione **Guardar plan**.

### 7.7 Agregar una competencia

1. Seleccione la versión correcta.
2. Seleccione **Agregar competencia**.
3. Complete **Nombre corto**.
4. Seleccione el tipo:
   - **Técnica**.
   - **Transversal**.
   - **Etapa práctica**.
5. Complete **Norma o descripción de la competencia**.
6. Escriba las **Horas del plan** como número entero mayor que cero.
7. Seleccione **Guardar competencia**.

El orden de las competencias corresponde al orden en que se agregan. El total de horas del plan se calcula automáticamente.

No se permiten dos competencias con el mismo nombre o la misma norma dentro de una versión.

### 7.8 Editar o quitar una competencia

1. Ubique la competencia en la tabla.
2. Seleccione **Editar** para modificarla o **Quitar** para eliminarla de la versión.
3. Confirme la operación cuando el sistema lo solicite.

> Los cambios realizados al plan no modifican las fichas que ya fueron creadas. Solamente aplican a fichas nuevas.

### 7.9 Eliminar programas o versiones

La eliminación debe utilizarse únicamente para corregir registros creados por error y que todavía no tengan fichas relacionadas.

Si el programa o plan ya fue utilizado:

- No lo elimine.
- Márquelo como inactivo.
- Conserve sus fichas y trazabilidad histórica.

## 8. Módulo Instructores

### 8.1 Buscar instructores

1. Ingrese a **Instructores**.
2. Escriba nombre, correo o teléfono.
3. Seleccione **Buscar**.

### 8.2 Crear un instructor

1. Seleccione **Nuevo instructor**.
2. Complete **Nombre completo**.
3. Complete el **Correo institucional**. Debe ser único.
4. Complete el teléfono si está disponible.
5. Seleccione la fecha de inicio del contrato.
6. Seleccione la fecha de finalización del contrato.
7. Deje las observaciones vacías si no se requieren.
8. Seleccione **Guardar instructor**.

El instructor se crea:

- **Activo**, si la fecha actual está dentro del contrato, incluyendo la fecha final.
- **Inactivo**, si el contrato aún no inicia o ya terminó.

> Crear un instructor no crea una cuenta de acceso al sistema.

### 8.3 Editar información del instructor

1. Ubique el instructor.
2. Seleccione **Editar**.
3. Actualice nombre, correo, teléfono u observaciones.
4. Seleccione **Guardar instructor**.

Los contratos no se cambian desde **Editar**. Se administran desde **Contratos** para conservar el histórico.

### 8.4 Consultar contratos

1. Ubique el instructor.
2. Seleccione **Contratos**.
3. Revise el **Histórico de contratos**.

Cada fila muestra el inicio, finalización y fecha en que fue registrado el contrato.

### 8.5 Registrar una renovación

1. Seleccione **Contratos** en el instructor correspondiente.
2. Revise la fecha final del contrato anterior.
3. Ingrese el inicio del nuevo contrato.
4. Ingrese la finalización del nuevo contrato.
5. Seleccione **Registrar renovación**.

Reglas importantes:

- La fecha final debe ser igual o posterior a la inicial.
- Dos contratos del mismo instructor no pueden superponerse.
- Para una renovación continua, el nuevo contrato debe iniciar al día siguiente del contrato anterior.
- Los contratos anteriores no se eliminan.
- El instructor vuelve a estar activo cuando existe un contrato vigente.

### 8.6 Instructor vinculado a la cuenta inicial

La cuenta creada durante la configuración inicial también genera un instructor. Si aparece **Sin contrato**:

1. Busque el instructor que tiene el mismo correo de la cuenta.
2. Seleccione **Contratos**.
3. Registre su primer contrato.

Esto permite que su estado también sea controlado automáticamente.

### 8.7 Estados automáticos

El sistema maneja únicamente:

- **Activo:** tiene al menos un contrato vigente.
- **Inactivo:** no tiene contrato vigente.

La fecha final del contrato es inclusiva. El instructor pasa a inactivo al día siguiente si no existe una renovación vigente. El sistema recalcula los estados al consultar la información y mediante una tarea automática diaria en producción.

Un instructor inactivo:

- No aparece para nuevas programaciones.
- No puede ser seleccionado como nuevo líder.
- Conserva todas sus asignaciones e históricos anteriores.

### 8.8 Eliminar un instructor

No elimine instructores que tengan fichas, liderazgos o programaciones asociadas. Si dejaron de trabajar, permita que finalice su contrato o déjelos inactivos.

Nunca elimine el instructor vinculado al correo de la cuenta principal, porque se necesita para crear fichas y registrar operaciones.

## 9. Módulo Fichas

### 9.1 Buscar y filtrar fichas

1. Ingrese a **Fichas**.
2. Use **Búsqueda** para localizar por número, municipio o líder.
3. Seleccione un programa o estado si necesita limitar los resultados.
4. Seleccione **Aplicar filtros**.
5. Use **Limpiar** para volver al listado completo.

### 9.2 Crear una ficha

Antes de crearla, confirme que:

- El programa está activo.
- Existe una versión del plan con sus competencias completas.
- El instructor asociado a la sesión está registrado y activo.

Procedimiento:

1. Seleccione **Nueva ficha**.
2. Escriba el **Número de ficha**. Debe ser único.
3. Seleccione el programa.
4. Seleccione la versión del plan.
5. Complete el municipio.
6. Complete la sede si corresponde.
7. Complete la modalidad, por ejemplo `Presencial`.
8. Marque los días de formación.
9. Para cada día, defina **Desde** y **Hasta**.
10. Seleccione la fecha de inicio.
11. Seleccione el fin de etapa lectiva.
12. Seleccione el fin de etapa práctica.
13. Agregue observaciones si son necesarias.
14. Seleccione **Crear ficha**.

Reglas de fechas:

- El fin lectivo no puede ser anterior al inicio.
- El fin práctico no puede ser anterior al fin lectivo.
- Debe existir al menos un día de formación.
- La hora final de cada jornada debe ser posterior a la inicial.

La ficha se crea en estado **Planeada** y recibe como líder al instructor vinculado a la cuenta que inició sesión.

Las competencias del plan se copian a la ficha. Desde ese momento, la ficha conserva su propia información aunque el plan se modifique después.

### 9.3 Estados de una ficha

| Estado | Uso recomendado |
| --- | --- |
| Planeada | La ficha fue creada, pero la formación todavía no comienza. |
| En formación | La ficha se encuentra en etapa lectiva. |
| Etapa práctica | Terminó la etapa lectiva y se encuentra en práctica. |
| Finalizada | Concluyó todo el proceso de la ficha. |
| Cancelada | La ficha fue cancelada y no continuará. |

### 9.4 Editar una ficha

1. Busque la ficha.
2. Seleccione **Editar**.
3. Cambie el estado o la información general necesaria.
4. Seleccione **Actualizar ficha**.

El programa y la versión del plan no se pueden cambiar después de crear la ficha.

Si la ficha ya tiene programaciones, el sistema no permite modificar fechas o jornadas de manera que alguna programación quede por fuera del periodo o del horario permitido.

### 9.5 Ver el detalle

1. Busque la ficha.
2. Seleccione **Ver detalle**.

La pantalla muestra:

- Número y estado de la ficha.
- Programa y versión del plan.
- Instructor líder.
- Ubicación y modalidad.
- Jornada permitida.
- Fechas vigentes.
- Cantidad de competencias.
- Total de horas del plan.
- Competencias finalizadas.
- Tabla de seguimiento de competencias.
- Observaciones generales.

### 9.6 Cambiar el instructor líder

1. Abra el detalle de la ficha.
2. En **Información general**, seleccione **Ver histórico**.
3. Revise los líderes anteriores y el líder actual.
4. Seleccione **Cambiar líder**.
5. Seleccione un instructor activo distinto al líder actual.
6. Indique la fecha efectiva del cambio.
7. Escriba el motivo.
8. Seleccione **Confirmar cambio**.

Reglas importantes:

- La ficha tiene un solo líder vigente.
- La fecha debe estar dentro del periodo de la ficha.
- Debe ser posterior al inicio de la asignación del líder actual.
- No se puede cambiar el líder de una ficha finalizada o cancelada.
- El líder anterior recibe como fecha final el día anterior al cambio.
- Todo el histórico se conserva con el usuario que registró la operación.

### 9.7 Eliminar una ficha

Eliminar una ficha también elimina sus seguimientos, segmentos, novedades, prórrogas e histórico de líderes. Por esta razón:

- Use **Eliminar** solamente si la ficha fue creada por error y todavía no se utiliza.
- Para una ficha real que no continuará, use el estado **Cancelada**.
- Para una ficha concluida, use el estado **Finalizada**.

## 10. Programación y seguimiento de competencias

### 10.1 Abrir la administración de una competencia

1. Abra el detalle de la ficha.
2. Busque la competencia en **Seguimiento de competencias**.
3. Seleccione **Administrar**.

La ventana muestra el estado, horas programadas, horas del plan, segmentos y novedades.

### 10.2 Agregar un segmento

1. Seleccione **Agregar segmento**.
2. Seleccione el instructor que dictará la competencia.
3. Defina la fecha inicial y final del segmento.
4. En **Bloques semanales**, seleccione el día.
5. Defina la hora **Desde** y **Hasta**.
6. Use **Agregar bloque** si la competencia se dicta más de un día por semana.
7. Revise el resumen:
   - **Ya programadas**.
   - **Este segmento**.
   - **Horas del plan**.
8. Seleccione **Guardar programación**.

El instructor líder puede dictar competencias, pero no se asigna automáticamente. Debe seleccionarse igual que cualquier otro instructor.

### 10.3 Cómo calcula las horas el sistema

El sistema cuenta cada aparición de los días seleccionados dentro del rango de fechas y multiplica esa cantidad por la duración del bloque.

Ejemplo: competencia de 12 horas que solamente se dicta los lunes durante 3 horas.

```text
Rango: cuatro semanas
Día: lunes
Horario: 07:00–10:00
Resultado: 4 lunes × 3 horas = 12 horas
```

El sistema no descuenta festivos automáticamente. Si un día no tendrá formación, ajuste el rango o divida la competencia en varios segmentos para representar únicamente las fechas reales.

### 10.4 Varias competencias el mismo día

Se pueden programar dos competencias el mismo día si los horarios no se cruzan. Ejemplo:

```text
Competencia A: 07:00–09:00
Competencia B: 09:00–12:00
```

No se permite:

```text
Competencia A: 07:00–10:00
Competencia B: 09:00–12:00
```

### 10.5 Reglas de programación

- Solo aparecen instructores activos.
- Los días deben existir en la jornada de la ficha.
- Las horas deben estar dentro del horario permitido para ese día.
- Los bloques de un mismo segmento no pueden cruzarse.
- El rango debe contener al menos una aparición de los días seleccionados.
- Las competencias técnicas y transversales deben quedar dentro de la etapa lectiva.
- La etapa práctica puede llegar hasta el fin práctico.
- La suma de segmentos no puede superar las horas del plan.
- Una ficha no puede tener dos competencias en el mismo horario.
- Un instructor no puede estar en dos fichas durante el mismo horario.
- Una competencia puede dividirse entre varios segmentos e instructores.

### 10.6 Editar o eliminar un segmento

1. Abra **Administrar** en la competencia.
2. Ubique el segmento.
3. Seleccione **Editar** para modificar instructor, fechas o bloques.
4. Seleccione **Eliminar** si el segmento fue creado por error.

Después de modificarlo, revise nuevamente el total de horas y el estado de la competencia.

### 10.7 Estados de una competencia

| Estado | Uso recomendado |
| --- | --- |
| Pendiente | Todavía no tiene programación. |
| Programada | Ya tiene al menos un segmento futuro o definido. |
| En ejecución | La formación de la competencia está siendo impartida. |
| Finalizada | Terminó y tiene exactamente las horas del plan programadas. |
| Suspendida | La formación fue detenida temporalmente. |
| Cancelada | La competencia no continuará. |

Para cambiar el estado:

1. Abra **Administrar**.
2. Seleccione el nuevo valor en **Estado de la competencia**.
3. Espere a que se actualice la información.

Restricciones:

- **Programada** y **En ejecución** requieren al menos un segmento.
- **Finalizada** requiere que las horas programadas sean exactamente iguales a las horas del plan.
- Una competencia con segmentos no puede volver a **Pendiente**. Primero debe eliminar las programaciones si realmente necesita reiniciarla.

## 11. Novedades

### 11.1 Registrar una novedad

1. Abra **Administrar** en la competencia.
2. En la sección **Novedades**, seleccione **Registrar novedad**.
3. Seleccione una fecha dentro del periodo de la ficha.
4. Seleccione el tipo:
   - Observación.
   - Reprogramación.
   - Cambio de instructor.
   - Suspensión.
   - Otra.
5. Describa claramente lo ocurrido.
6. Seleccione **Guardar novedad**.

La novedad conserva la fecha y el nombre del usuario que la registró.

### 11.2 Editar o eliminar una novedad

1. Ubique la novedad dentro de la competencia.
2. Seleccione **Editar** para corregirla.
3. Seleccione **Eliminar** solamente si fue registrada por error.

Las novedades sirven como histórico. No las elimine únicamente porque la situación ya fue resuelta.

## 12. Módulo Prórrogas

### 12.1 Crear una solicitud

1. Ingrese a **Prórrogas**.
2. Seleccione **Nueva prórroga**.
3. Seleccione la ficha.
4. Revise las fechas actuales mostradas por el sistema.
5. Defina el nuevo fin de etapa lectiva.
6. Defina el nuevo fin de etapa práctica.
7. Escriba el motivo.
8. Seleccione **Crear solicitud**.

Reglas importantes:

- No se puede solicitar una prórroga para una ficha finalizada o cancelada.
- Ambas fechas nuevas deben ampliar las fechas actuales.
- El nuevo fin práctico no puede ser anterior al nuevo fin lectivo.
- Una ficha solamente puede tener una solicitud pendiente al mismo tiempo.
- Crear la solicitud no modifica todavía las fechas de la ficha.

### 12.2 Editar o eliminar una solicitud pendiente

1. Ubique la solicitud.
2. Seleccione **Editar** para modificar fechas o motivo.
3. Seleccione **Eliminar** si la solicitud fue creada por error.

Estas acciones solamente están disponibles mientras la solicitud permanezca **Pendiente**.

### 12.3 Aprobar una prórroga

1. Ubique la solicitud pendiente.
2. Seleccione **Aprobar**.
3. Revise la comparación entre fechas actuales y nuevas.
4. Escriba una observación de la decisión si se requiere.
5. Seleccione **Aprobar** nuevamente.

Al aprobar:

- La solicitud cambia a **Aprobada**.
- Las nuevas fechas se aplican inmediatamente a la ficha.
- El registro queda conservado como histórico.
- Las nuevas programaciones pueden usar el periodo ampliado.

### 12.4 Rechazar una prórroga

1. Seleccione **Rechazar**.
2. Escriba la observación o motivo de la decisión.
3. Confirme con **Rechazar**.

La ficha conserva sus fechas actuales y la solicitud queda en el histórico como **Rechazada**.

### 12.5 Consultar el histórico

Use el filtro **Estado** para mostrar solicitudes pendientes, aprobadas o rechazadas. Las solicitudes resueltas muestran **Histórico conservado** y ya no pueden editarse ni eliminarse.

## 13. Dashboard o Control general

El dashboard permite revisar toda la operación sin abrir ficha por ficha.

### 13.1 Indicadores superiores

- **Fichas:** cantidad de fichas visibles con los filtros actuales.
- **Pendientes:** competencias pendientes.
- **Programadas:** competencias programadas o en ejecución.
- **Finalizadas:** competencias finalizadas.
- **Novedades:** total de novedades.
- **Prórrogas pendientes:** fichas con una solicitud pendiente.

### 13.2 Filtros

Puede filtrar por:

- Número de ficha, municipio o líder.
- Programa.
- Estado de la ficha.
- Fichas con o sin novedades.

Los indicadores se recalculan según los filtros aplicados.

### 13.3 Matriz de seguimiento

La matriz permite consultar:

- Programa y ficha.
- Instructor líder.
- Ubicación y fechas.
- Competencias.
- Estado de cada competencia.
- Horas del plan, programadas y pendientes.
- Instructores y horarios asignados.
- Novedades.
- Última prórroga.

Si la matriz es más ancha que la pantalla, desplácese horizontalmente.

### 13.4 Uso recomendado

Revise periódicamente:

1. Competencias pendientes sin programación.
2. Competencias cuya fecha se acerca y todavía tienen horas pendientes.
3. Programaciones sin instructor o con inconsistencias reportadas.
4. Novedades recientes.
5. Prórrogas pendientes de decisión.

## 14. Rutina operativa recomendada

### 14.1 Al inicio de cada semana

1. Revise el dashboard.
2. Filtre por fichas en formación.
3. Identifique competencias pendientes o con horas incompletas.
4. Verifique vencimientos de contratos de instructores.
5. Revise solicitudes de prórroga pendientes.

### 14.2 Cuando cambia una programación

1. Abra la competencia.
2. Registre una novedad de tipo **Reprogramación**.
3. Edite o divida el segmento correspondiente.
4. Confirme que las horas no superen el plan.
5. Verifique que no aparezcan conflictos de horario.

### 14.3 Cuando cambia un instructor

Para una competencia:

1. Registre una novedad de tipo **Cambio de instructor**.
2. Edite el segmento o cree uno nuevo para el reemplazo.
3. Verifique las horas totales.

Para el liderazgo de la ficha:

1. Abra **Ver histórico**.
2. Use **Cambiar líder**.
3. Registre fecha efectiva y motivo.

### 14.4 Cuando termina un contrato

1. Consulte **Instructores**.
2. Verifique que el instructor figure como inactivo si no fue renovado.
3. Si fue renovado, registre un contrato nuevo; no modifique ni elimine el anterior.
4. Revise las programaciones futuras antes de asignar reemplazos.

### 14.5 Al cerrar una competencia

1. Confirme que todas las sesiones estén representadas en los segmentos.
2. Confirme que **Programadas / plan** muestre exactamente el mismo número de horas.
3. Registre cualquier novedad final necesaria.
4. Cambie el estado a **Finalizada**.
5. Revise el dashboard.

### 14.6 Al cerrar una ficha

1. Verifique el estado de todas las competencias.
2. Revise novedades y prórrogas.
3. Cambie la ficha a **Etapa práctica** cuando corresponda.
4. Al concluir completamente, cambie la ficha a **Finalizada**.
5. No elimine la ficha.

## 15. Solución de problemas frecuentes

### No aparece el botón para crear una ficha

- Verifique que exista al menos un programa activo.
- Verifique que el programa tenga una versión del plan.
- Actualice la página después de corregirlo.

### La ficha no se puede crear porque falta el instructor líder

- La cuenta debe tener un instructor con el mismo correo o nombre.
- Busque el correo de la cuenta en **Instructores**.
- No elimine el instructor asociado a la cuenta principal.
- Confirme que se encuentre activo.

### No aparece un instructor en la programación

- Revise su contrato.
- Confirme que la fecha actual esté dentro de un contrato vigente.
- Registre una renovación si corresponde.
- Recargue la pantalla de la ficha.

### El nuevo contrato se superpone con otro

- Revise el histórico de contratos.
- El nuevo inicio debe ser posterior al final del contrato anterior si se trata de una renovación consecutiva.
- Corrija las fechas y guarde nuevamente.

### No puedo programar una competencia

Compruebe que:

- El instructor esté activo.
- Las fechas estén dentro de la etapa permitida.
- El día esté habilitado en la ficha.
- El horario esté dentro de la jornada.
- El rango contenga los días seleccionados.
- Las horas nuevas no superen las horas del plan.

### Aparece conflicto de horario dentro de la ficha

Ya existe otra competencia en el mismo periodo y horario. Cambie la hora, el día o el rango de fechas.

### Aparece que el instructor tiene formación en otra ficha

El instructor ya tiene un bloque coincidente en otra ficha. Seleccione otro instructor o mueva el horario.

### No puedo finalizar una competencia

- Verifique que tenga programación.
- Revise **Programadas / plan**.
- Los dos valores deben ser exactamente iguales.
- Edite, agregue o elimine segmentos hasta completar las horas correctas.

### No puedo volver una competencia a pendiente

Una competencia con programación no puede regresar a pendiente. Elimine primero todos los segmentos si realmente necesita reiniciar su seguimiento.

### No puedo reducir las fechas o la jornada de una ficha

Una programación existente quedaría fuera del nuevo periodo u horario. Primero edite o elimine esa programación y luego actualice la ficha.

### La prórroga no actualizó inmediatamente las fechas

- Confirme que la solicitud fue **Aprobada**, no solamente creada.
- Abra nuevamente el detalle de la ficha o recargue la página.
- Verifique las fechas en la ficha y en el histórico de prórrogas.

### No puedo crear otra prórroga

- La ficha puede tener una solicitud pendiente.
- Resuelva o elimine la solicitud pendiente antes de crear otra.
- Las fichas finalizadas o canceladas no aceptan prórrogas.

### Agregué una competencia al plan y no aparece en una ficha

Es el comportamiento esperado. Las fichas conservan las competencias copiadas al momento de su creación. La nueva competencia aparecerá únicamente en nuevas fichas creadas con esa versión.

### La sesión se cerró o apareció la pantalla de ingreso

1. Inicie sesión nuevamente.
2. Abra el módulo donde estaba trabajando.
3. Compruebe si la última operación quedó guardada antes de repetirla.

### La aplicación no carga

1. Verifique la conexión a internet.
2. Actualice la página una vez.
3. Intente desde otro navegador o una ventana privada.
4. Confirme que la dirección sea la correcta.
5. Si continúa, contacte soporte e indique la pantalla, hora y mensaje mostrado.

## 16. Buenas prácticas de información

- Use siempre el mismo formato para nombres de programas y versiones.
- No cree códigos, correos o números de ficha duplicados.
- Registre motivos claros en cambios de líder y prórrogas.
- Registre novedades en el momento en que ocurren.
- No utilice novedades para reemplazar programaciones o prórrogas; cada dato debe registrarse en su módulo correspondiente.
- Revise el total de horas antes de finalizar una competencia.
- No elimine históricos para “limpiar” la pantalla.
- Use estados inactivos, cancelados o finalizados para cerrar procesos.
- Solicite respaldos periódicos de la base de datos al responsable técnico.

## 17. Seguridad y protección de datos

- No comparta la contraseña por correo, chat público o documentos impresos.
- No publique capturas que incluyan correos, teléfonos o datos de conexión.
- No comparta variables de entorno, cadenas de Neon o secretos de Vercel.
- Cierre sesión al terminar.
- Mantenga actualizado el navegador.
- No permita que personas no autorizadas modifiquen contratos, líderes, estados o prórrogas.
- Reporte inmediatamente accesos o cambios sospechosos.

## 18. Información que el sistema no administra actualmente

La versión actual no incluye:

- Recuperación visual de contraseña.
- Creación de cuentas adicionales desde la interfaz.
- Carga de evidencias o archivos por competencia.
- Calendario automático de días festivos.
- Importación masiva desde Excel.
- Notificaciones por correo.
- Pruebas E2E automatizadas.

Estos puntos no impiden el uso de los flujos descritos, pero deben considerarse durante la operación.

## 19. Lista rápida de verificación

Antes de considerar una ficha correctamente configurada, confirme:

- [ ] El programa está activo.
- [ ] La versión correcta está activa.
- [ ] Todas las competencias y horas están registradas.
- [ ] La ficha tiene fechas y jornada correctas.
- [ ] El instructor líder vigente es correcto.
- [ ] Los instructores tienen contratos vigentes.
- [ ] Las programaciones respetan jornada y fechas.
- [ ] No existen conflictos de horario.
- [ ] Las horas programadas coinciden con el plan al finalizar.
- [ ] Las novedades relevantes están registradas.
- [ ] Las prórrogas aprobadas aparecen en las fechas de la ficha.
- [ ] El dashboard muestra el avance esperado.

## 20. Registro de soporte

Cuando reporte un problema, entregue:

1. Fecha y hora del incidente.
2. Módulo y pantalla.
3. Número de ficha, programa o instructor relacionado.
4. Acción que estaba realizando.
5. Mensaje exacto mostrado por el sistema.
6. Captura de pantalla sin contraseñas ni información sensible.
7. Confirmación de si el problema continúa después de actualizar la página.

---

**Fin del manual de usuario.**
