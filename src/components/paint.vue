<template>
  <div style="height:99%;">
    <canvas  :id="canvasId" class="canvas-style" v-on:mousedown="mouseDown" />
  </div>
</template>
<script>
    // TODO: move all of this logic to master
    // packages
    const paper = require('paper');
    export default {
        name: "Canvas",
        data: () => ({
            path: null,
            scope: null,
            canvasId : "test"
        }),
        methods: {
            reset() {
                this.scope.project.activeLayer.removeChildren();
            },
            pathCreate(scope) {
                scope.activate();
                return new paper.Path({
                    strokeColor: "#000000",
                    strokeJoin: 'round',
                    strokeWidth: 1.5
                })
            },
            createTool(scope) {
                scope.activate();
                return new paper.Tool();
            },
            mouseDown() {
              this.tool = this.createTool(this.scope);
              this.tool.onMouseDown = (event) => {
                  this.path = this.pathCreate(this.scope);
                  this.path.add(event.point);
              };
              this.tool.onMouseDrag = (event) => {
                  this.path.add(event);
              };
              this.tool.onMouseUp = (event) => {
                  this.path.add(event.point);
              }
            },
            temp() {
              this.path = this.pathCreate(this.scope);
              this.path.add({x : 40, y : 40});
              this.path.add({x : 66, y : 60});
            }
        },
        mounted() {
            this.scope = new paper.PaperScope();
            this.scope.setup(this.canvasId);
            this.temp()
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
</style>