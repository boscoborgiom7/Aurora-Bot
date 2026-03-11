const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")

const sock = makeWASocket({
auth: state,
printQRInTerminal: true,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update

if(connection === "close") {
const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
if(shouldReconnect) {
startBot()
}
}

if(connection === "open") {
console.log("✅ Aurora Bot conectado a WhatsApp")
}
})

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if(!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

const from = msg.key.remoteJid

if(text === "hola"){
await sock.sendMessage(from,{text:"👋 Hola, soy Aurora Bot"})
}

})

}

startBot()
