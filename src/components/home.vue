<template>
  <div>
    <v-btn
      @click="capture"
      class="capture_btn mx-2"
      fab
      dark
      x-large
      :color="!uuid ? 'green' : 'red'"
    >
      <span v-if="!uuid">paint</span>
      <span v-else>stop</span>
    </v-btn>
    
    <p v-for="(item, i) in gyroscope" :key="i">
      {{item}}
    </p>

    <v-row
      class="colorPalette"
      align="center"
      justify="center"
    >
      <v-btn-toggle
        v-model="colorSelected"
        rounded
        @change="changeColor"
      >
        <v-btn v-for="c in colors" :key="c" :color="c"></v-btn>
      </v-btn-toggle>
    </v-row>

    <h1  :style="style">+</h1>
  </div>
</template>

<script>
  import * as Colyseus from "colyseus.js";
  import { v4 as uuidv4 } from 'uuid';
  import {get} from 'vuex-pathify'
  
  export default {
    data() {
      return {
        gyroscope : [],
        initPos : [],
        room : null,
        uuid: null,
        colorSelected: 0
      }
    },
    computed: {
      h() {return window.innerWidth},
      w() {return window.innerHeight},
      colors: get("general/colors"),
      style() {
        if(this.gyroscope.length == 0) {
          return `position: absolute; top: ${this.h/2}px; left: ${this.w/2}px;`
        } else {
          let x = this.w / 2 + this.gyroscope[1]
          let y =  this.h / 2 + this.gyroscope[0]
          return `position: absolute; top: ${x}px; left: ${y}px;`
        }
      }
    },
    methods: {
      changeColor() {
        let color = this.colors[this.colorSelected]
        this.room.send("userChanged", {key : "color", value: color} )
      },
      capture() {
        this.uuid = this.uuid ? null : uuidv4()
        this.room.send("userChanged", {key : "pathId", value: this.uuid} )
      },
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
        this.room.send("gyro", s.quaternion )
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
      
      let client = new Colyseus.Client(process.env.VUE_APP_BACKEND);
      client.joinOrCreate("my_room").then(room => this.room = room)


    },
  }
</script>

<style lang="scss" scoped>
.capture_btn {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
  height: 30vh;
  width: 30vh;
}
.colorPalette {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 0%;
}
</style>