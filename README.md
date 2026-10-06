# MoveMate

MoveMate es una aplicación móvil desarrollada con React Native y Expo para registrar y consultar actividades físicas.

La aplicación permite iniciar caminatas, carreras o recorridos en bicicleta, registrar ubicación mediante GPS, calcular distancia y calorías estimadas, visualizar el recorrido en un mapa y mantener un historial de actividades.

También incorpora autenticación con Firebase, almacenamiento local, sincronización en la nube, animaciones, gestos y tema claro/oscuro.

## Tecnologías utilizadas

- React Native
- Expo SDK 57
- TypeScript
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Expo Location
- React Native WebView
- Leaflet
- OpenStreetMap
- AsyncStorage
- Firebase Authentication
- Cloud Firestore
- pnpm
- EAS Build

## Funcionalidades

- Dashboard principal con resumen diario.
- Inicio de actividades:
  - Caminata.
  - Carrera.
  - Bicicleta.
- Seguimiento de ubicación mediante GPS.
- Registro de puntos del recorrido.
- Visualización del recorrido en un mapa.
- Cálculo de distancia.
- Estimación de calorías.
- Temporizador de actividad.
- Historial de actividades.
- Filtros por tipo de actividad.
- Filtros por fecha.
- Eliminación mediante gesto swipe.
- Persistencia local con AsyncStorage.
- Registro e inicio de sesión con Firebase.
- Sincronización de actividades con Firestore.
- Separación de actividades por usuario.
- Tema claro y oscuro.
- Animaciones mediante React Native Reanimated.
- Generación de APK mediante EAS Build.

## Estructura principal

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
├── app.json
├── eas.json
├── package.json
└── pnpm-lock.yaml