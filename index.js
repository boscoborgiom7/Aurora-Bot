const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        browser: ["Aurora Bot", "Chrome", "1.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {

        const { connection, qr } = update;

        if (qr) {
            console.log("SCAN THIS QR WITH WHATSAPP:");
            console.log(qr);
        }

        if (connection === "open") {
            console.log("Aurora Bot connected to WhatsApp 🚀");
        }

        if (connection === "close") {
            console.log("Connection closed, retrying...");
            startBot();
        }

    });

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const msg = messages[0];

        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        if (text) {

            await sock.sendMessage(msg.key.remoteJid, {
                text: "Aurora Bot recibió: " + text
            });

        }

    });

}

startBot();

app.get("/", (req, res) => {
    res.send("Aurora WhatsApp Bot running 🤖");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
