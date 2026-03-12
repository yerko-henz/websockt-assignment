# WebSockets Assignment

## Instrucciones para ejecutar el proyecto

```bash
npm install # en cada proyecto
npm run dev # en root, montará todo lo necesario para revisar
```

## Decisiones técnicas relevantes

- Theme básico definido en la root del proyecto para homologar estilos.
- Auth e historial de mensajes persisten en localstorage.
- Desconexión limpia el localstorage.
- El estado que se reutiliza en varios lugares se dejó en estado global.

## Breve explicación de la arquitectura utilizada

- Toda la lógica relacionada con sockets está centralizada en un service en ambos frontends.
- Se separó todo en componentes dependiendo de la función que cumplen.
