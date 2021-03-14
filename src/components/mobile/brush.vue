<template>
  <div>
    <div v-if="btnNav == 0">
      <v-row class="ma-5 justify-center justify-space-around">
        <v-btn @click="undo" color="success">
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn @click="redo" color="success">
          <v-icon>mdi-redo</v-icon>
        </v-btn>

        <v-btn @click="restore" color="success">
          <v-icon>mdi-delete-empty</v-icon>
        </v-btn>

      </v-row>
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
      
      <v-row
        class="ma-0 colorPalette"
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
      <v-row
        class="strokePalette"
        align="center"
        justify="center"
      >
        <v-btn-toggle
          v-model="strokeSelected"
          rounded
          @change="changeStroke"
        >
          <v-btn v-for="s in strokes" :key="s" >
            <div :style="`height: ${s}px; width: ${s}px; border-radius: 50%; background-color: #555;`"></div>
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </div>

    <div v-else>
      <v-row class="ma-3 justify-left" style="heigth : 100%;">
        <v-card v-for="(img, id) in images" :key="id" @click="addImage(img.src)" class="ma-2" height="40vw" width="40vw">
          <v-img class="images" :src="img.src" />
        </v-card>
      </v-row>
  </div>

  
    <v-bottom-navigation absolute
      v-model="btnNav"
      color="primary"
    >
      <v-btn>
        <span>Paint</span>
        <v-icon>mdi-pen</v-icon>
      </v-btn>

      <v-btn>
        <span>Paste image</span>

        <v-icon>mdi-content-paste</v-icon>
      </v-btn>

    </v-bottom-navigation>



  </div>
</template>

<script>
  import * as Colyseus from "colyseus.js";
  import { v4 as uuidv4 } from 'uuid';
  import {get} from 'vuex-pathify'
  import urljoin from "url-join"
  
  export default {
    props : ["roomId"],
    data() {
      return {
        room : null,
        uuid: null,
        colorSelected: 0,
        strokeSelected: 0,
        btnNav : 0,
        images : [
          {src : "https://firebasestorage.googleapis.com/v0/b/gyropaint.appspot.com/o/coloring%2Fbmw.png?alt=media"},
          {src : "https://firebasestorage.googleapis.com/v0/b/gyropaint.appspot.com/o/coloring%2F7310-raskraska-Bolshoe-krasivoe-yabloko-raskraska.gif?alt=media"},
        ]
      }
    },
    computed: {
      h() {return window.innerWidth},
      w() {return window.innerHeight},
      colors: get("general/colors"),
      strokes: get("general/strokes"),
      server: get("general/server"),
      protocolWS: get("general/protocolWS"),
    },
    methods: {
      changeColor() {
        let color = this.colors[this.colorSelected]
        this.room.send("userChanged", {key : "color", value: color} )
      },
      changeStroke() {
        let stroke = this.strokes[this.strokeSelected]
        this.room.send("userChanged", {key : "strokeSize", value: stroke} )
      },
      undo() {
        this.room.send("undo")
      },
      redo() {
        this.room.send("redo")
      },
      restore() {
        this.room.send("restore")
      },
      capture() {
        this.uuid = this.uuid ? null : uuidv4()
        this.room.send("userChanged", {key : "pathId", value: this.uuid} )
      },
      handleSensor(s) {
        this.room.send("gyro", s.quaternion )
      },
      addImage(src) {
        this.room.send("addImage", src)
      }
    },
    created() {
      let client = new Colyseus.Client(urljoin(this.protocolWS, this.server))
      client.joinOrCreate(this.roomId).then(room => this.room = room)

      
      let sensor = new RelativeOrientationSensor({ frequency: 60 });
      sensor.onreading = () => this.handleSensor(sensor)
      sensor.start();


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
  bottom: 20%;
}
.strokePalette {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 10%;
}


.images {
  object-fit: cover;
  height: 100%;
}
</style>