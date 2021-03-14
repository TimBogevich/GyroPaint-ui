<template>
  <div >
    <canvas  ref="canv" class="canvas-style" />
  </div>
</template>

<script>
// @ is an alias to /src
import display from '@/components/display.vue'

export default {
  components: {
    display
  },
  mounted() {
    let canvas = this.$refs.canv
    let ctx = canvas.getContext("2d");
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(400, 250)
    ctx.fillStyle = "#f44336";
    ctx.stroke();
    debugger
  },
}
</script>


<style scoped>
    .canvas-style {
        cursor: crosshair;
        width: 100% !important;
        height: 100% !important;
    }
</style>
