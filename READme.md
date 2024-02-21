# README - Proyecto Inemuri Helper

## Descripción del Proyecto

El proyecto "Inemuri Helper" es una aplicación web que proporciona ayuda a los usuarios que desean tomar siestas o dormir durante sus viajes o trayectos, alertándolos cuando están cerca de su destino deseado.

La aplicación utiliza la tecnología de geolocalización para rastrear la posición del usuario y determinar su proximidad al destino establecido. Cuando el usuario se acerca a su destino, la aplicación emite una alarma audible y vibra para alertar al usuario de que está cerca de su parada. Además, proporciona una interfaz interactiva para seleccionar diferentes sonidos de alarma.

## Funcionalidades requeridas

1. Definir el lugar de destino en el mapa (Para ello con hacer click sobre el mapa un marcador de destino aparece.).
2. Controlar si el usuario está en proximidad de su destino.
3. Vibrar si el usuario está cerca de su destino.

## Funcionalidades adicionales

1. Sonido de alarma cuando el usuario esta cerca de su destino.
2. Boton (rojo) que al hacer click centra la pantalla en el usuario.
3. Boton (azul) que abre un menu de ajuste y eliges el sonido entre cuatro opciones y la distancia umbral que quieras.
4. Barra de busqueda que permite buscar el destino.

## APIs usadas

- **Leaflet**: Biblioteca de mapas interactivos de código abierto para la creación de mapas móviles.
- **Leaflet Control Geocoder**: Plugin de Leaflet para proporcionar una función de búsqueda y geocodificación de direcciones.
- **SweetAlert2**: Librería de JavaScript para interfaz cuando suena la alarma

## Cómo Usar

1. Abre la aplicación en un navegador web compatible con geolocalización.
2. Selecciona un sonido de alarma de la lista desplegable disponible.
3. Haz clic en el mapa para establecer tu destino.
4. La aplicación te alertará cuando te acerques a tu destino con la alarma seleccionada y vibración.
5. Si deseas desactivar la alarma, confirma la acción en el cuadro de diálogo que aparece.

## Decisiones de diseño

1. De 500m y 2km es mi diseño de umbral minimo y maximo.
2. Al abrir la pagina web, te centra en el usuario.
3. Solo puedo exister un marcador de destino a la vez.
3. Cuando la alarma se activa aparece un evento para desactivarla y tambien borra el marcador de destino.