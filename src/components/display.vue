<template>
  <div>
    <p>
      {{[x,y]}}
    </p>

    <p v-for="item in users" :key="item.id">
      {{item.avatar}} . {{item.x}} {{item.y}} 
    </p>
    <h1  :style="style">+</h1>
  </div>
</template>

<script>
  import {get} from "vuex-pathify"
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
      users : get("general/users"),
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
        this.x = this.h / 2 + dist[1]
        this.y = this.w / 2 + dist[0]
        

      },
    },
    created() {
      this.$store.dispatch("general/init")
    },
  }
</script>

<style lang="scss" scoped>

</style>