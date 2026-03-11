const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")

const sock = makeWASocket({
auth: state
})

sock.ev.on("connection.update", (update) => {

const { qr, connection } = update

if(qr){
qrcode.generate(qr, {small:true})
}

if(connection === "open"){
console.log("✅ Aurora Bot conectado")
}

})

sock.ev.on("creds.update", saveCreds)

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
