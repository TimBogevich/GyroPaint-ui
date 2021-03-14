<template>
  <div style="height:99%;">
    <vue-qrcode id="qr" :value="roomUrl" :margin="0" :color="color" :scale="3"/>
    <canvas  ref="canv" id="canv" />


    <div id="circle" v-for="user in users" :key="user.id" :style="style(user)">
      <span id="avatar">
        {{user.avatar}}
      </span>
    </div>

    <img class="coloringImage" :src="image">
    <v-btn @click="undo" id="undo" color="success">undo</v-btn>
  </div>
</template>

<script>
  import {get} from "vuex-pathify"
  import VueQrcode from 'vue-qrcode'
  import UndoCanvas from "undo-canvas"
  export default {
      props : ["roomUrl"],
      components : {VueQrcode},
      data: () => ({
          paths: new Map(),
          pathPrevCoord : new Map(),
          ctx : null,
          scope: null,
          initPos : [],
          color : {
            dark: '#5ab55e', 
            light: '#ffffffff'
          }
      }),
      computed: {
        users : get("general/users"),
        room : get("general/room"),
        colors : get("general/colors"),
        image : get("general/image"),
        hm() { return window.innerHeight /2 },
        wm() { return window.innerWidth /2 },
        coordinates() {
          return this.users.map(i => {
            return {
              pathId: i.pathId,
              color: i.color,
              strokeSize: i.strokeSize,
              x: window.innerHeight /2 + i.x,
              y: window.innerWidth /2 + i.y
            }
          }).filter(i => i.pathId)
        }
      },
      watch: {
        coordinates: {
          handler: function (val, oldVal) {
            val.forEach(p => {
              let prew = this.pathPrevCoord.get(p.pathId)
              if(!prew) {
                this.pathPrevCoord.set(p.pathId, {y: p.y, x:p.x})
              } else {
                this.ctx.beginPath();
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.strokeSize;
                this.ctx.shadowColor = p.color;;
                this.ctx.shadowBlur = 10;
                this.ctx.lineCap = 'round';
                this.ctx.moveTo(prew.y, prew.x);
                this.ctx.lineTo(p.y, p.x);
                this.pathPrevCoord.set(p.pathId, {y: p.y, x:p.x})
              }

              this.ctx.stroke();
              this.ctx.closePath()
              
            });
          },
        }
      },
      methods: {
        style : (user) =>   `top: ${window.innerHeight /2 + user.x}px; 
                            left: ${window.innerWidth /2 + user.y}px; 
                            -webkit-transition; 
                            width: ${user.strokeSize}px;
                            background: ${user.color};
                            height: ${user.strokeSize}px;`,
        undo() {this.ctx.undo()},
        redo() {this.ctx.redo()},
        restore() {this.ctx.undo()},
      },
      mounted() {
        let canvas = this.$refs.canv
        canvas.setAttribute("width", window.innerWidth);
        canvas.setAttribute("height", window.innerHeight);
        this.ctx = canvas.getContext("2d");
        UndoCanvas.enableUndo(this.ctx)
        this.room.onMessage("undo", (message) => {
          this.undo()
        });
        this.room.onMessage("redo", (message) => {
          this.redo()
        });
        this.room.onMessage("restore", (message) => {
          this.restore()
        });

      }
  }
</script>

<style scoped>
  canvas {
      cursor: crosshair;
      width: 100% !important;
      height: 100% !important;
      z-index: -999 !important;
  }

  #qr {
    position: absolute;
    margin: 5px;
  }

  .coloringImage {
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    max-height: 80%;
    object-fit: contain;
  }

  #circle {
    position: absolute;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    transform: translate(-57%, -50%);
    margin: 0px;
    border: solid black 2px;
  }

  #undo {
    position: absolute;
    top: 2%;
    right: 30px;
  }

</style>