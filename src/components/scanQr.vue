<template>
  <v-container grid-list-xs>
    <qrcode-stream v-if="scanQR" @decode="onDecode"></qrcode-stream>
    <v-row class="pa-5 justify-center">
      <v-form>
        <v-text-field
          outline
          number
          v-model="roomId"
        ></v-text-field>
        <v-btn @click="$emit('code', roomId)" color="success">go</v-btn>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'


  export default {
    components: {
      QrcodeStream,
      QrcodeDropZone,
      QrcodeCapture
    },
    data() {
      return {
        scanQR : true,
        roomId : "",
      }
    },
    methods: {
      onDecode(value)  {
        this.$emit("code", value)
      }
    },
    
  }
</script>

<style lang="scss" scoped>

</style>