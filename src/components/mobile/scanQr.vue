<template>

  <v-container grid-list-xs>
    <qrcode-stream @init="onInit" @decode="onDecode">
      <v-row class="mt-5 justify-center loading-indicator" v-if="loading">
        <v-progress-circular
          :size="70"
          id="progress"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </qrcode-stream>

    <v-row class="pa-5 justify-center">
      <v-form>
        <v-text-field
          outline
          label="or enter the number manually"
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
        loading: false,
        roomId : "",
      }
    },
    methods: {
      onDecode(value)  {
        window.navigator.vibrate(200)
        this.$emit("code", value)
      },
    async onInit (promise) {
      this.loading = true

      try {
        await promise
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    },
    
  }
</script>

<style lang="scss" scoped>

</style>