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
        coordinates() {
          return this.users.map(i => {
            return {
              pathId: i.pathId,
              x: i.x,
              y: i.y
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
              path?.add({y: p.x, x: p.y})
              
            });
          },
        }
      },
      methods: {
        style : (user) =>   `top: ${user.x}px; left: ${user.y}px; -webkit-transition`,
        pathCreate(scope) {
            scope.activate();
            return new paper.Path({
              strokeColor: '#E4141B',
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
        this.$store.dispatch("general/init")
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
        border: 5px solid black;
        border-radius: 10px;
        display: block;
        margin: auto;
        box-shadow: 0 10px 8px -8px black;
    }

    .abs {
      position: absolute;
    }
</style>