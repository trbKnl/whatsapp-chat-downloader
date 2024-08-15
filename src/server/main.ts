import express from "express";
import http from 'http'
import { Socket, Server } from "socket.io"
import ViteExpress from "vite-express";
import { Client, Chat }  from 'whatsapp-web.js'
import { Buffer } from 'buffer';
import JSZip from 'jszip';

const app = express()
const server = http.createServer(app)

// socket IO
const io = new Server(server)
const FILE_NAME_DATA = "data.json"
const FILE_NAME_ZIP = "WhatsappData.zip"


io.on("connection", async (socket) => {

  console.log("connected!")
  const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });

  client.on('ready', async () => {
      await client.getState()
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay

      const chats = await getChatsWithTimeout(client)
      if (chats !== undefined) {
        const zipFileBuffer = await jsonStringToZipFile(JSON.stringify(chats[0].name))
        sendZipFileToClient(socket, zipFileBuffer)
      }
  });

  client.on('qr', async (url) => {
    socket.emit("connectWhatsapp", url)
  });

  client.initialize()

})


async function getChatsWithTimeout(client: Client, maxAttempts = 5): Promise<Chat[] | undefined> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const chats = await Promise.race([
        client.getChats(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
      ]);
      if (chats !== undefined) {
        return chats as Chat[];
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, retrying...`);
    }
  }
  console.log('Failed to get chats after multiple attempts');
};


async function jsonStringToZipFile(jsonString: string): Promise<Buffer> {
  const buffer = Buffer.from(jsonString, 'utf-8');
  const zip = new JSZip();
  zip.file(FILE_NAME_DATA, buffer);
  
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });
  
  return zipBuffer;
}

function sendZipFileToClient(socket: Socket, zipBuffer: Buffer): void {
  socket.emit('zipfile', {
    filename: FILE_NAME_ZIP,
    data: zipBuffer
  });
}


server.listen(3000, () =>
  console.log(`server listening at http://localhost:${3000}`)
)

ViteExpress.bind(app, server)
