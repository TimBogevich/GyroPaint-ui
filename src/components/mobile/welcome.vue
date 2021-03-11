<template>
  <div>
    <v-row class="ma-5 justify-center">
      <h1 class="logo_text">
        Gyropaint
      </h1>
    </v-row>
    <v-row class="ma-5">
      <h4>
        1. Open this site on a big screen like TV or Projector
      </h4>
      <h4>
        2. Scan QR code on your another screen
      </h4>
      <h4>
        3. Flip your phone to draw
      </h4>
    </v-row>

    <v-row class="ma-5 justify-center">
      <v-btn elevation="10" @click="$emit('toScan')" id="scanQR" color="primary">
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

  @font-face {
    font-family: "Sweet";
    src: local("Sweet"),
    url(../../assets/sweet.ttf) format("truetype");
  }
 
  .logo_text {
     font-family: "Sweet";
     font-size: 20vw;
     text-shadow: 16px 11px 10px rgba(0,0,0,0.6);
     color: rgba(72, 78, 107, 0.842);
  }
</style>