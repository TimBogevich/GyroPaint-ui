<template>
  <div>
    <h3 v-for="(item, i) in gyroscope" :key="i">
      {{item}}
    </h3>
    <h3  :style="style">POINT</h3>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        gyroscope : [],
        initPos : [],
      }
    },
    computed: {
      h() {return window.innerWidth},
      w() {return window.innerHeight},
      style() {
        if(this.gyroscope.length == 0) {
          return `position: absolute; top: ${this.h/2}px; left: ${this.w/2}px;`
        } else {
          let x = this.w / 2 + this.gyroscope[1] / 2
          let y =  this.h / 2 + this.gyroscope[0] / 2
          return `position: absolute; top: ${x}px; left: ${y}px;`
        }
      }
    },
    methods: {
      calcDist(angle, initAngle) {
        angle = (angle - initAngle) * (180 / Math.PI);
        angle = angle < 0 ? angle + 360 : angle;
        angle = angle > 180 ? angle - 360 : angle;
  
        let dist = Math.round(-800 * Math.tan(angle * (Math.PI / 180)));
        return dist;
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
        let angles = this.toEuler(s.quaternion)
        
        if(this.initPos.length == 0) {
          this.initPos = angles
        }

        let dist = angles.map((angle, i) => this.calcDist(angle, this.initPos[i]))
        this.gyroscope = dist
      },
    },
    created() {
      let sensor = new RelativeOrientationSensor({ frequency: 60 });
      sensor.onreading = () => this.handleSensor(sensor)
      sensor.start();
    },
  }
</script>

<style lang="scss" scoped>

</style>