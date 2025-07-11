# 🤖 Bot de Rutina - Google Calendar

Un bot automático que crea y gestiona tu rutina diaria en Google Calendar con bloques de tiempo específicos para maximizar tu productividad.

## 🚀 Características

- ✅ **Automatización completa**: Crea eventos recurrentes automáticamente
- 🗓️ **Solo días laborables**: Excluye automáticamente fines de semana
- 🧹 **Limpieza inteligente**: Elimina eventos antiguos antes de crear nuevos
- 📅 **Fecha automática**: Siempre comienza desde la fecha actual
- ⏰ **Recordatorios**: Notificaciones automáticas 10 minutos antes

## 📋 Bloques de rutina incluidos

- **🔥 Despierta y ataca** (08:30 - 09:00): Ducha fría + agua + lista de tareas
- **💻 Deep Work** (09:30 - 12:30): Enfoque máximo sin distracciones

## 🛠️ Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/bot-rutina.git
   cd bot-rutina
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura Google Calendar API**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google Calendar
   - Crea credenciales (OAuth 2.0)
   - Descarga el archivo JSON y renómbralo a `credentials.json`
   - Colócalo en la raíz del proyecto

## 🔧 Configuración

1. **Copia tus credenciales**:
   ```bash
   # Coloca tu archivo credentials.json en la raíz del proyecto
   # ⚠️ NUNCA subas este archivo a Git (ya está en .gitignore)
   ```

2. **Ajusta tu zona horaria** (opcional):
   - Edita `src/index.ts`
   - Cambia `"Europe/Madrid"` por tu zona horaria

## 🚀 Uso

Ejecuta el bot:
```bash
npm run start
```

La primera vez te pedirá autorización:
1. Se abrirá un enlace en tu navegador
2. Autoriza la aplicación
3. Copia el código que te da Google
4. Pégalo en la terminal

## 📁 Estructura del proyecto

```
bot-rutina/
├── src/
│   └── index.ts          # Código principal del bot
├── credentials.json      # Credenciales de Google (NO INCLUIDO)
├── token.json           # Token de acceso (se genera automáticamente)
├── package.json         # Dependencias del proyecto
├── tsconfig.json        # Configuración de TypeScript
└── README.md           # Esta documentación
```

## ⚙️ Personalización

### Añadir nuevos bloques de tiempo

Edita el array `bloques` en `src/index.ts`:

```typescript
const bloques = [
  {
    summary: "🏃‍♂️ Ejercicio",
    description: "Rutina de ejercicios matutina",
    startTime: "07:00",
    endTime: "08:00",
    recurrence: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=30",
  },
  // ... más bloques
];
```

### Cambiar duración de la rutina

Modifica el `COUNT` en la regla de recurrencia:
- `COUNT=20` = 4 semanas laborables
- `COUNT=40` = 8 semanas laborables

## 🔒 Seguridad

- ✅ `credentials.json` y `token.json` están en `.gitignore`
- ✅ No subas nunca tus credenciales a GitHub
- ✅ El token se renueva automáticamente

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes problemas:
1. Verifica que `credentials.json` esté en la raíz del proyecto
2. Asegúrate de que la API de Google Calendar esté habilitada
3. Comprueba que tu zona horaria sea correcta

---

⭐ **¡Dale una estrella si te ayuda con tu productividad!**
