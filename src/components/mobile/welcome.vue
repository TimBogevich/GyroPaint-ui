<template>
  <div>
    <v-row class="ma-5 justify-center">
      <h1>
        Welcome to gyropaint
      </h1>
    </v-row>
    <v-row class="ma-5">
      <h3>
        1. Open this site on a big screen like TV or Projector
      </h3>
      <h3>
        2. Scan QR code on your another screen
      </h3>
      <h3>
        3. Flip your phone to draw
      </h3>
    </v-row>

    <v-row class="ma-5 justify-center">
      <v-btn @click="$emit('toScan')" id="scanQR" color="primary">
        <div>
          Scan QR code 
        </div>
        <v-icon x-large>
          mdi-qrcode-scan
        </v-icon>
      </v-btn>

    </v-row>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
#scanQR {
  height: 80vw;
  width: 80vw;
}
</style>