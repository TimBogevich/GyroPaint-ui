<template>
  <div>
    <v-row class="justify-center my-5">
      <v-card elevation="15" shaped>
        <vue-qrcode :value="url" :margin="1" :color="color" :scale="10"/>
      </v-card>
    </v-row>
    <v-row class="justify-center text--disabled my-5">
      <h1>
        Scan this code to paint
      </h1>
    </v-row>
    <v-row class="justify-center text--disabled my-5">
      <h1>
        or enter this code:
      </h1>
    </v-row>
    <v-row class="justify-center  my-5">
      <h1>
        {{url.split("/").reverse()[0]}}
      </h1>
    </v-row>
  </div>
</template>
<script>

import VueQrcode from 'vue-qrcode'

export default {
  props : ["url"],
  components: {
    VueQrcode,
  },
  data() {
    return {
      color : {
        dark: '#5ab55e', 
        light: '#ffffffff'
      }
    }
  },

}
</script>