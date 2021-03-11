<template>
  <div style="height:99%;">
    <vue-qrcode id="qr" :value="roomUrl" :margin="0" :color="color" :scale="3"/>
    <canvas  ref="canv" id="canv" class="canvas-style" />

    <div v-for="user in users" :key="user.id" class="abs" :style="style(user)">
      <v-row>
        <h2>+</h2>  <span>{{user.avatar}}</span>
      </v-row>
    </div>
  </div>
</template>
<script>
  import {get} from "vuex-pathify"
  import VueQrcode from 'vue-qrcode'
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
        colors : get("general/colors"),
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
        style : (user) =>   `top: ${window.innerHeight /2 + user.x}px; left: ${window.innerWidth /2 + user.y}px; -webkit-transition`,
      },
      mounted() {
        let canvas = this.$refs.canv
        canvas.setAttribute("width", window.innerWidth);
        canvas.setAttribute("height", window.innerHeight);
        this.ctx = canvas.getContext("2d");


      }
  }
</script>

<style scoped>
    .canvas-style {
        cursor: crosshair;
        width: 100% !important;
        height: 100% !important;
    }

    .abs {
      position: absolute;
    }

    #qr {
      position: absolute;
      margin: 5px;
    }
</style>