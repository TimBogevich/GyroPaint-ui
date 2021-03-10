<template>
  <div style="height:99%;">
    <canvas  :id="canvasId" class="canvas-style" />

    <div v-for="user in users" :key="user.id" class="abs" :style="style(user)">
      <v-row>
        <h2>+</h2>  <span>{{user.avatar}}</span>
      </v-row>
    </div>
  </div>
</template>
<script>
  import {get} from "vuex-pathify"
  const paper = require('paper');
  export default {
      name: "Canvas",
      data: () => ({
          paths: new Map(),
          scope: null,
          canvasId : "test",
          initPos : [],
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
              let path = this.paths.get(p.pathId)
              if(!path) {
                path = this.pathCreate(this.scope);
                this.paths.set(p.pathId, path)
              }
              if(path.strokeColor != p.color) {
                path.strokeColor = p.color
              }
              if(path.strokeWidth != p.strokeSize) {
                path.strokeWidth = p.strokeSize
              }

              path?.add({y: p.x, x: p.y})
              
            });
          },
        }
      },
      methods: {
        style : (user) =>   `top: ${window.innerHeight /2 + user.x}px; left: ${window.innerWidth /2 + user.y}px; -webkit-transition`,
        pathCreate(scope) {
            scope.activate();
            return new paper.Path({
              strokeColor: 'red',
              strokeWidth: 10,
              strokeCap: 'round'
            })
        },
        createTool(scope) {
            scope.activate();
            return new paper.Tool();
        },
      },
      mounted() {
        this.$store.dispatch("general/init", {board : true})
        this.scope = new paper.PaperScope();
        this.scope.setup(this.canvasId);
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
</style>