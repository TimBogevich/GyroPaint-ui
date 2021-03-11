<template>
  <div>
    <scanQr @code="goDraw($event)" v-if="mode == 'qr'" />
    <brush v-else-if="mode == 'brush'"  :roomId="roomId"/>
  </div>
</template>

<script>
  import brush from "./brush"
  import scanQr from "./scanQr"
  export default {
    components : {
      brush,
      scanQr,
    },
    data() {
      return {
        mode: "qr",
        roomId : null,
      }
    },
    methods: {
      goDraw(value) {
        this.roomId = value.split("/").reverse()[0]
        debugger
        this.mode = "brush"
      }
    },

    
  }
</script>

<style lang="scss" scoped>

</style>