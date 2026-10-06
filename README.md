# MoveMate

MoveMate es una aplicación móvil desarrollada con React Native y Expo orientada al seguimiento de actividad física.

La aplicación permite iniciar caminatas, carreras o recorridos en bicicleta, registrar la ubicación mediante GPS, calcular la distancia recorrida y las calorías estimadas, visualizar el recorrido en un mapa y mantener un historial de actividades.

También incorpora almacenamiento local, autenticación con Firebase, sincronización en la nube, animaciones, gestos y tema claro/oscuro.

---

## Objetivo

El objetivo de MoveMate es desarrollar una aplicación móvil que permita registrar actividades físicas utilizando funciones propias de un dispositivo móvil, principalmente el GPS.

Durante una actividad se registran distintos datos como:

- Tipo de actividad.
- Tiempo transcurrido.
- Ubicación.
- Distancia.
- Calorías estimadas.
- Puntos del recorrido.

Las actividades pueden guardarse y consultarse posteriormente desde el historial.

---

## Tecnologías utilizadas

El proyecto utiliza las siguientes tecnologías:

- React Native.
- Expo SDK 57.
- TypeScript.
- Expo Router.
- React Native Reanimated.
- React Native Gesture Handler.
- Expo Location.
- React Native WebView.
- Leaflet.
- OpenStreetMap.
- AsyncStorage.
- Firebase Authentication.
- Cloud Firestore.
- pnpm.
- EAS Build.

---

## Funcionalidades

### Dashboard principal

La pantalla principal muestra un resumen de la actividad diaria.

Incluye información como:

- Pasos.
- Distancia.
- Calorías.
- Porcentaje del objetivo diario.

También contiene un botón flotante que permite iniciar una nueva actividad.

### Tipos de actividad

MoveMate permite seleccionar entre tres tipos de actividad:

- Caminata.
- Carrera.
- Bicicleta.

Después de seleccionar una actividad, la aplicación abre la pantalla de seguimiento.

### Seguimiento GPS

La ubicación del usuario se obtiene mediante Expo Location.

Al comenzar una actividad se solicita permiso para acceder a la ubicación del dispositivo.

Mientras la actividad se encuentra activa se registran diferentes puntos con:

- Latitud.
- Longitud.
- Timestamp.

Estos puntos permiten calcular la ruta realizada.

### Mapa

El recorrido se visualiza mediante:

- React Native WebView.
- Leaflet.
- OpenStreetMap.

El mapa muestra la posición actual del usuario y el recorrido registrado durante la actividad.

Esta implementación permite utilizar mapas sin depender directamente de Google Maps Platform.

### Cálculo de distancia

La distancia recorrida se calcula utilizando las coordenadas obtenidas mediante GPS.

Los diferentes puntos registrados se comparan para obtener la distancia total aproximada de la actividad.

### Calorías

La aplicación realiza una estimación de calorías según:

- Tipo de actividad.
- Distancia recorrida.

Cada tipo de actividad utiliza un valor diferente para realizar el cálculo aproximado.

### Historial

Las actividades finalizadas pueden guardarse y consultarse posteriormente desde la sección Historial.

Cada actividad muestra:

- Tipo.
- Fecha.
- Distancia.
- Duración.
- Calorías.

El historial se actualiza cada vez que se ingresa nuevamente a la pantalla.

### Filtros

El historial permite filtrar las actividades.

Filtros por tipo:

- Todas.
- Caminata.
- Carrera.
- Bicicleta.

Filtros por fecha:

- Todas.
- Hoy.
- Últimos 7 días.
- Últimos 30 días.

### Gestos

Las actividades del historial pueden eliminarse mediante un gesto de swipe.

Al deslizar una tarjeta hacia la izquierda aparece una zona de eliminación.

El sistema fue desarrollado utilizando:

- React Native Gesture Handler.
- React Native Reanimated.

### Almacenamiento local

AsyncStorage se utiliza para guardar información localmente.

Las actividades se almacenan de forma separada según el usuario.

Cuando existe un usuario autenticado se utiliza una clave asociada a su ID.

Cuando no existe una sesión iniciada, las actividades se almacenan como invitado.

Esto evita mezclar información entre diferentes usuarios.

### Firebase Authentication

MoveMate incorpora autenticación mediante Firebase.

Desde la pantalla Perfil el usuario puede:

- Crear una cuenta.
- Iniciar sesión.
- Cerrar sesión.

Firebase asigna un identificador único a cada usuario.

### Cloud Firestore

Cloud Firestore se utiliza para almacenar las actividades en la nube.

Cada actividad almacenada incluye información como:

- ID.
- Tipo de actividad.
- Fecha de inicio.
- Fecha de finalización.
- Duración.
- Distancia.
- Calorías.
- Ruta.
- ID del usuario.

Cuando un usuario inicia sesión, MoveMate puede recuperar sus actividades almacenadas en Firestore.

### Tema claro y oscuro

MoveMate incorpora tema claro y oscuro.

El sistema detecta inicialmente el tema configurado en el dispositivo.

Desde la pantalla Perfil también se puede cambiar manualmente.

La preferencia queda almacenada mediante AsyncStorage.

El estado del tema se administra mediante un Context Provider para que el cambio afecte a toda la aplicación.

### Animaciones

La aplicación utiliza React Native Reanimated para incorporar diferentes animaciones.

Entre ellas se encuentran:

- Animaciones de entrada.
- Aparición de estadísticas.
- Transiciones de elementos.
- Animación del botón flotante.

---

## Estructura del proyecto

```text
MoveMate/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── history.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   │
│   ├── activity/
│   │   └── active.tsx
│   │
│   └── _layout.tsx
│
├── assets/
│
├── components/
│   ├── ActivityHistoryCard.tsx
│   ├── ActivityMap.tsx
│   ├── ActivityTypeModal.tsx
│   ├── AnimatedStat.tsx
│   └── FloatingStartButton.tsx
│
├── constants/
│   └── theme.ts
│
├── hooks/
│   ├── useAppTheme.tsx
│   └── useAuth.tsx
│
├── services/
│   ├── auth.ts
│   ├── cloudActivities.ts
│   ├── firebase.ts
│   ├── location.ts
│   └── storage.ts
│
├── types/
│   └── activity.ts
│
├── .env
├── app.json
├── eas.json
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar a la carpeta:

```bash
cd MoveMate
```

Instalar dependencias:

```bash
pnpm install
```

---

## Ejecutar el proyecto

Para iniciar Expo:

```bash
pnpm exec expo start
```

Después se puede abrir la aplicación mediante Expo Go desde un dispositivo Android.

Si es necesario limpiar la caché:

```bash
pnpm exec expo start --clear
```

---

## Firebase

El proyecto utiliza Firebase para autenticación y almacenamiento en la nube.

Firebase Authentication se utiliza para:

- Crear cuentas.
- Iniciar sesión.
- Cerrar sesión.
- Identificar a cada usuario.

Cloud Firestore se utiliza para almacenar las actividades realizadas por los usuarios.

Las principales variables utilizadas por Firebase se encuentran en el archivo `.env`.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## Generación de APK

El proyecto utiliza EAS Build para generar una versión Android.

Primero se inicia sesión en Expo:

```bash
pnpm dlx eas-cli login
```

Después se vincula el proyecto con Expo si es necesario:

```bash
pnpm dlx eas-cli init
```

Para configurar EAS Build:

```bash
pnpm dlx eas-cli build:configure
```

La configuración del build se encuentra en:

```text
eas.json
```

Para generar un APK Android se utiliza:

```bash
pnpm dlx eas-cli build -p android --profile preview
```

El perfil `preview` se encuentra configurado para generar un archivo APK instalable.

---

## Pruebas realizadas

Durante el desarrollo se probaron las principales funcionalidades de MoveMate.

Se verificó:

- Navegación entre pantallas.
- Dashboard principal.
- Selección de actividades.
- Permisos de ubicación.
- Obtención de ubicación mediante GPS.
- Temporizador de actividad.
- Registro de puntos del recorrido.
- Cálculo de distancia.
- Cálculo de calorías.
- Visualización del mapa.
- Guardado de actividades.
- Historial.
- Filtros por tipo.
- Filtros por fecha.
- Swipe para eliminar.
- Persistencia mediante AsyncStorage.
- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Guardado de actividades en Firestore.
- Recuperación de actividades.
- Tema claro y oscuro.
- Animaciones.
- Generación mediante EAS Build.

---

## Dificultades encontradas

Durante el desarrollo aparecieron diferentes problemas relacionados principalmente con Expo Router, Firebase, mapas y compilación.

Uno de los primeros problemas ocurrió al crear la ruta:

```text
/activity/active
```

Expo Router no reconocía inicialmente la nueva pantalla debido a que los tipos generados se encontraban desactualizados.

El problema se solucionó reiniciando Expo y el servidor de TypeScript.

También apareció un problema con el sistema de temas.

Inicialmente cada pantalla manejaba su propio estado, por lo que cambiar el tema desde Perfil no actualizaba toda la aplicación.

La solución fue crear un contexto global mediante `AppThemeProvider`, permitiendo que todas las pantallas compartieran el mismo estado.

Otro problema estuvo relacionado con Firebase Authentication.

Firebase mostraba una advertencia relacionada con la persistencia de sesión en React Native.

La autenticación se mantuvo utilizando `getAuth()`, permitiendo utilizar normalmente el registro, inicio de sesión y cierre de sesión.

También se presentaron dificultades con `react-native-maps`.

Durante las pruebas el mapa base no se visualizaba correctamente y requería configuración adicional mediante Google Maps Platform.

Para evitar esa dependencia se reemplazó la implementación por:

- React Native WebView.
- Leaflet.
- OpenStreetMap.

Con este cambio se pudo visualizar correctamente el mapa y el recorrido.

Finalmente se trabajó con EAS Build para preparar una versión Android.

Durante este proceso fue necesario:

- Crear una cuenta en Expo.
- Vincular el proyecto.
- Configurar el `projectId`.
- Corregir el slug.
- Generar un keystore.
- Configurar el perfil `preview`.
- Ejecutar la compilación Android.

---

## Resultado final

MoveMate permite actualmente:

- Visualizar un dashboard.
- Seleccionar caminata, carrera o bicicleta.
- Registrar actividades físicas.
- Utilizar GPS.
- Registrar puntos del recorrido.
- Mostrar el recorrido en un mapa.
- Calcular distancia.
- Estimar calorías.
- Mostrar la duración de la actividad.
- Guardar actividades.
- Consultar un historial.
- Filtrar actividades.
- Eliminar actividades mediante gestos.
- Guardar información localmente.
- Crear usuarios.
- Iniciar y cerrar sesión.
- Sincronizar información con Firebase.
- Recuperar actividades desde Firestore.
- Cambiar entre tema claro y oscuro.
- Mantener la preferencia del tema.
- Utilizar animaciones.
- Preparar una versión Android mediante EAS Build.

