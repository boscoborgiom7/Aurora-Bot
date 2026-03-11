const express = require("express")
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

const app = express()
const PORT = process.env.PORT || 3000

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false,
browser: ["AuroraBot","Chrome","1.0"]
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, lastDisconnect } = update

if(connection === "open"){
console.log("✅ WhatsApp conectado correctamente")
}

if(connection === "close"){

const shouldReconnect =
(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut)

console.log("🔄 reconectando...")

if(shouldReconnect){
startBot()
}

}

})

/* GENERAR PAIRING CODE */

if(!sock.authState.creds.registered){

setTimeout(async () => {

try{

const code = await sock.requestPairingCode("5215568012991")

console.log("")
console.log("================================")
console.log("🔑 CODIGO PARA VINCULAR WHATSAPP")
console.log(code)
console.log("================================")
console.log("")

}catch(err){

console.log("❌ Error generando pairing code")

}

},10000)

}

/* RESPUESTA DEL BOT */

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if(!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

if(text){

await sock.sendMessage(msg.key.remoteJid,{
text:"Aurora Bot recibió: " + text
})

}

})

}

startBot()

app.get("/", (req,res)=>{
res.send("Aurora WhatsApp Bot running 🤖")
})

app.listen(PORT, ()=>{
console.log("🚀 Server running on port " + PORT)
})
