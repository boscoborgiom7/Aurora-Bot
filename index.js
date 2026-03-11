const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state
        printQRInTerminal : true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text) {
            await sock.sendMessage(msg.key.remoteJid, { text: "Aurora Bot recibió: " + text });
        }
    });
}

startBot();

app.get("/", (req, res) => {
    res.send("Aurora WhatsApp Bot running 🤖");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
