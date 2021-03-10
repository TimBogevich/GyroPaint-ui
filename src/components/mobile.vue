<template>
  <div>
    <qrcode-stream v-if="scanQR" @decode="onDecode"></qrcode-stream>
    {{test}}
  </div>
</template>

<script>
  import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
  import brush from "./brush"

  export default {
    components: {
      QrcodeStream,
      QrcodeDropZone,
      QrcodeCapture
    },
    data() {
      return {
        scanQR : true,
        test: null
      }
    },
    methods: {
      onDecode(value)  {
        this.test = value
      }
    },
    
  }
</script>

<style lang="scss" scoped>

</style>