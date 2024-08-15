<template>
  <div class="text-center">
    <div v-if="url === ''" class="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center mx-auto">
      <span class="text-gray-600 text-sm">Waiting for QR code...</span>
    </div>
    <canvas 
      ref="canvas" 
      class="mx-auto mt-4 transition-opacity duration-300" 
      :class="{ 'opacity-0 h-0': !isQrCodeReady, 'opacity-100': isQrCodeReady }"
    ></canvas>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isQrCodeReady: false 
    }
  },
  watch: {
    url: {
      handler: 'generateQrCode',
      immediate: true,
    }
  },
  methods: {
    generateQrCode() {
      if (this.url === '') {
        this.isQrCodeReady = false;
        return;
      }

      this.$nextTick(() => {
        const canvas = this.$refs.canvas;
        QRCode.toCanvas(canvas, this.url, { errorCorrectionLevel: 'H' }, (error) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log('QR code generated!');
          this.isQrCodeReady = true;
        });
      });
    },
  },
};
</script>
