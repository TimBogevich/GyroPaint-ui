<template>
  <div>
    <welcome @toScan="mode='qr'" v-if="mode == 'welcome'" />
    <scanQr @code="goDraw($event)" v-else-if="mode == 'qr'" />
    <brush v-else-if="mode == 'brush'"  @logout="mode='qr'" :roomId="roomId"/>
    <v-progress-circular
      v-else-if="mode == 'load'"
      :size="70"
      id="progress"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
  import brush from "./brush"
  import scanQr from "./scanQr"
  import welcome from "./welcome"
  export default {
    components : {
      brush,
      scanQr,
      welcome,
    },
    data() {
      return {
        mode: "welcome",
        roomId : null,
      }
    },
    methods: {
      async goDraw(value) {
        this.roomId = value.split("/").reverse()[0]
        this.mode = 'load'
        await new Promise(r => setTimeout(r, 2000));
        this.mode = "brush"
        
      }
    },

    
  }
</script>

<style lang="scss" scoped>
#progress {
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}
</style>