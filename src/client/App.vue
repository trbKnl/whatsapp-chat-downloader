<template>
  <div id="app" class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <h1 class="text-2xl font-semibold text-center text-gray-800 mb-4">
            WhatsApp Data Downloader
          </h1>
          <p class="text-gray-600 text-center mb-8">
            Scan the QR code below to connect your whatsapp and receive all your chat data!
          </p>
          
          <QrCodeGenerator :url="whatsappConnectionUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "./socket";
import QrCodeGenerator from './components/QrCodeGenerator.vue';
import { saveAs } from 'file-saver';

export default {
  name: "App",
  components: {
    QrCodeGenerator,
  },
  data() {
    return {
      whatsappConnectionUrl: ""
    }
  },
  methods: {
  },

  created() {
    socket.connect()

    socket.on("connectWhatsapp", (url) => {
      this.whatsappConnectionUrl = url
    })

    socket.on('zipfile', ({filename, data }) => {
      const blob = new Blob([data], { type: 'application/zip' });
  
      // Use file-saver to save the file
      saveAs(blob, filename);
    });

  }
}
</script>

