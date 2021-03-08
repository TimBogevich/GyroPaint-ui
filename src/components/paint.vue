<template>
  <div style="height:99%;">
    <canvas  :id="canvasId" class="canvas-style" v-on:mousedown="mouseDown" />
  </div>
</template>
<script>
    import * as Colyseus from "colyseus.js";
    const paper = require('paper');
    export default {
        name: "Canvas",
        data: () => ({
            path: null,
            scope: null,
            canvasId : "test",
            initPos : [],
        }),
        computed: {
          h() {return window.innerHeight},
          w() {return window.innerWidth},
        },
        methods: {
            reset() {
                this.scope.project.activeLayer.removeChildren();
            },
            pathCreate(scope) {
                scope.activate();
                return new paper.Path({
                  strokeColor: '#E4141B',
                  strokeWidth: 20,
                  strokeCap: 'round'
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

            },
            calcDist(angle, initAngle) {
              angle = (angle - initAngle) * (180 / Math.PI);
              angle = angle < 0 ? angle + 360 : angle;
              angle = angle > 180 ? angle - 360 : angle;
        
              return Math.round(-800 * Math.tan(angle * (Math.PI / 180)));
            },
          toEuler(q) {
                let sinr_cosp = 2 * (q[3] * q[0] + q[1] * q[2]);
                let cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
                let roll = Math.atan2(sinr_cosp, cosr_cosp);

                let siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
                let cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
                let yaw = Math.atan2(siny_cosp, cosy_cosp);
            
                return [yaw, roll];
          },
          handleSensor(s) {
            let angles = this.toEuler(s)
            
            if(this.initPos.length == 0) {
              this.initPos = angles
            }

            let dist = angles.map((angle, i) => this.calcDist(angle, this.initPos[i]))
            let y = this.h / 2 + dist[1]
            let x = this.w / 2 + dist[0]
            this.path.add({x,y})

          }
        },
        mounted() {
          let client = new Colyseus.Client(process.env.VUE_APP_BACKEND);
          this.scope = new paper.PaperScope();
          this.scope.setup(this.canvasId);
          this.path = this.pathCreate(this.scope);
          client.joinOrCreate("my_room").then(room => {
            room.state.onChange = (changes) => {
                changes.forEach(change => {
                    this.handleSensor(Array.from(change.value))
                });
            };
          })
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