import fs from "fs";
import { google } from "googleapis";
import readline from "readline";

// Ruta a credenciales y token
const CREDENTIALS_PATH = "./credentials.json";
const TOKEN_PATH = "./token.json";

// Alcance: permisos de Calendar
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function authorize(credentials: any, callback: (auth: any) => void) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Si ya existe un token guardado
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, "utf-8");
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } else {
    getAccessToken(oAuth2Client, callback);
  }
}

function getAccessToken(oAuth2Client: any, callback: (auth: any) => void) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("\n🔗 Autoriza esta app visitando este link:\n", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nPega aquí el código que te da Google: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) {
        console.error("❌ Error obteniendo el token:", err);
        return;
      }
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log("✅ Token guardado en", TOKEN_PATH);
      callback(oAuth2Client);
    });
  });
}

// Prueba básica: listar los próximos 5 eventos de tu calendario
function listEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err: any, res: any) => {
      if (err) return console.error("❌ API error:", err);
      const events = res.data.items;
      if (!events || events.length === 0) {
        console.log("📅 No upcoming events found.");
        return;
      }
      console.log("✅ Próximos eventos:");
      events.forEach((event: any) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`- ${start} | ${event.summary}`);
      });
    }
  );
}

function createEvent(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: "💻 Deep Work",
    description: "Bloque de enfoque total. Sin distracciones.",
    start: {
      dateTime: "2025-07-11T09:30:00+02:00", // Ajusta fecha y hora
      timeZone: "Europe/Madrid",
    },
    end: {
      dateTime: "2025-07-11T12:30:00+02:00", // Ajusta fecha y hora
      timeZone: "Europe/Madrid",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=30"], // Repetir todos los días 30 veces
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 10 }],
    },
  };

  calendar.events.insert(
    {
      calendarId: "primary",
      requestBody: event,
    },
    (err: any, res: any) => {
      if (err) return console.error("❌ Error creando evento:", err);
      console.log("✅ Evento creado:", res.data.htmlLink);
    }
  );
}

async function deleteExistingEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });

  try {
    // Buscar eventos desde hace 30 días hacia el futuro
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 30);

    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 365); // Buscar hasta 1 año en el futuro

    console.log("🔍 Buscando eventos existentes para eliminar...");

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 1000,
      singleEvents: true,
    });

    const events = response.data.items || [];
    const eventsToDelete = events.filter((event: any) => {
      const summary = event.summary?.toLowerCase() || "";
      return (
        summary.includes("deep work") ||
        summary.includes("despierta y ataca") ||
        summary.includes("💻") ||
        summary.includes("🔥")
      );
    });

    console.log(
      `📊 Encontrados ${eventsToDelete.length} eventos para eliminar`
    );

    for (const event of eventsToDelete) {
      try {
        if (event.id) {
          await calendar.events.delete({
            calendarId: "primary",
            eventId: event.id,
          });
          console.log(`🗑️ Eliminado: ${event.summary}`);
        }
      } catch (error) {
        console.error(`❌ Error eliminando evento ${event.summary}:`, error);
      }
    }

    console.log("✅ Limpieza completada!");
    return eventsToDelete.length;
  } catch (error) {
    console.error("❌ Error en la limpieza de eventos:", error);
    return 0;
  }
}

async function createEventsBatch(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });

  // Primero eliminar eventos existentes
  console.log("🧹 Limpiando eventos existentes...");
  await deleteExistingEvents(auth);

  console.log("🚀 Creando nuevos eventos...");

  const bloques = [
    {
      summary: "🔥 Despierta y ataca",
      description: "Ducha fría + agua + lista de tareas",
      startTime: "08:30",
      endTime: "09:00",
      recurrence: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=30", // Solo días laborables
    },
    {
      summary: "💻 Deep Work",
      description: "Enfoque máximo",
      startTime: "09:30",
      endTime: "12:30",
      recurrence: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=60", // Solo días laborables
    },
    // Añade más bloques aquí
  ];

  const baseDate = new Date().toISOString().split("T")[0]; // Fecha actual automática

  for (const bloque of bloques) {
    const event = {
      summary: bloque.summary,
      description: bloque.description,
      start: {
        dateTime: `${baseDate}T${bloque.startTime}:00+02:00`,
        timeZone: "Europe/Madrid",
      },
      end: {
        dateTime: `${baseDate}T${bloque.endTime}:00+02:00`,
        timeZone: "Europe/Madrid",
      },
      recurrence: [bloque.recurrence],
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }],
      },
    };

    try {
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
      console.log(`✅ Evento creado: ${bloque.summary}`);
    } catch (err) {
      console.error("❌ Error creando evento:", err);
    }
  }

  console.log("🎉 ¡Rutina configurada correctamente!");
}

// Carga credenciales y ejecuta
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
authorize(credentials, createEventsBatch);
