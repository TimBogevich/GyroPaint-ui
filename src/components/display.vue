<template>
  <div>
    <p>
      {{[x,y]}}
    </p>
    <h1  :style="style">+</h1>
  </div>
</template>

<script>
  import * as Colyseus from "colyseus.js";
  export default {
    data() {
      return {
        quaternion : [],
        initPos : [],
        x: window.innerHeight,
        y: window.innerWidth,
      }
    },
    computed: {
      h() {return window.innerHeight},
      w() {return window.innerWidth},
      style() {
        return `position: absolute; top: ${this.x}px; left: ${this.y}px; -webkit-transition`
      }
    },
    methods: {
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
        debugger
        this.x = this.h / 2 + dist[1]
        this.y = this.w / 2 + dist[0]
        
        // let yNew = this.y + y
        // let xNew = this.x + x

        // if (yNew > 0 && yNew < this.w) {
        //   this.y = yNew
        // } else {
        //   this.initPos = angles
        // }
        
        // if (xNew > 0 && xNew < this.h) {
        //   debugger
        //   this.x = xNew
        // } else {
        //   this.initPos = angles
        // }

      },
    },
    created() {

      let client = new Colyseus.Client("ws://localhost:2567");
      client.joinOrCreate("my_room").then(room => {
        room.state.onChange = (changes) => {
            changes.forEach(change => {
                this.handleSensor(Array.from(change.value))
            });
        };
      })


    },
  }
</script>

<style lang="scss" scoped>

</style>