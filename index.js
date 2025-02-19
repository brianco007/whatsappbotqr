const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
let qrCodeData = null; // Variable to store the latest QR code

const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios"); // To fetch contacts from the API

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");

// Initialize WhatsApp client
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

// Add event listeners
client.on("ready", () => {
  console.log("Client is ready!");
});

// Listening to all incoming messages
client.on("message_create", (message) => {
  console.log(message.body);
  // client.sendMessage("Tienes una nueva resserva!")
});

// QR CODE GENERATION
client.on("qr", (qr) => {
  console.log("QR Code received, generating it as an image...", qr);

  // Store QR code as a data URL
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error("Failed to generate QR code", err);
    } else {
      console.log("QR code generated. Check localhost:3000/qr");
      qrCodeData = url; // Save the QR code data URL
    }
  });
});

client.on("disconnected", (reason) => {
  console.log("Client disconnected:", reason);
   // Limpia cualquier estado o sesión, si es necesario
   client.destroy().then(() => {
    client.initialize();
  });
  // Optionally, clear the session if the disconnection is persistent
});

client.on("auth_failure", (message) => {
  console.error("Authentication failed:", message);
  // Consider clearing the session and prompting for a new QR code
});

// Initialize the client
client.initialize();





// *********************** END OF WHATSAPP CLIENT INITIALIZATION  ***********************
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Endpoint to send messages
app.post("/send-qr", async (req, res) => {
  const { contactsApiUrl, messageTemplate } = req.body;
console.log(contactsApiUrl)
  try {
    // Fetch contacts from API
    const response = await axios.get(contactsApiUrl);
    const contacts = response.data; // Assuming API returns an array of objects

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: "Invalid or empty contact list" });
    }

    // Send messages with QR codes
    for (const contact of contacts) {
      const phone = contact["Teléfono"];
      const name = contact["Nombre"];
      const qrCodeText = contact["Código"];

      if (!phone || !qrCodeText) {
        console.warn(`Skipping contact: ${JSON.stringify(contact)}`);
        continue;
      }

      const chatId = "57" + phone + "@c.us"; 

      // Generate QR code image
      const qrCodeDataUrl = await qrcode.toDataURL(qrCodeText);
      const media = new MessageMedia("image/png", qrCodeDataUrl.split(",")[1]);

      // const qrCodeDataUrl = "https://quickchart.io/qr?text=" + qrCodeText + "&size=200";
      // const media = new MessageMedia("image/png", qrCodeDataUrl);

      // Personalize the message
      const message = messageTemplate.replace("{name}", name);

      try {
        await client.sendMessage(chatId, media, { caption: message });
        console.log(`✅ QR code sent to ${name} (${phone})`);
      } catch (error) {
        console.error(`❌ Failed to send QR to ${phone}:`, error);
      }
    }

    res.json({ success: true, message: "QR codes sent successfully!" });
  } catch (error) {
    console.error("🚨 Error fetching contacts or sending messages:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
});

// Route to serve the QR code
app.get("/qr", (req, res) => {
  if (qrCodeData) {
    res.send(`<img src="${qrCodeData}" alt="QR Code" />`);
  } else {
    res.send("QR code not generated yet.");
  }
});

// 1️⃣ Ruta para mostrar la vista con el formulario
app.get("/", (req, res) => {
  res.render("dashboard", { 
    messageTemplate: "¡Hola, {name}! Este es el código QR que debes presentar al final del evento para registrar tu asistencia. No olvides presentarlo antes de salir. Te esperamos.",
    query: req.query  // Pasamos req.query a la vista
  });
});

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(PORT, () => {
  console.log("listening from port", PORT);
});
