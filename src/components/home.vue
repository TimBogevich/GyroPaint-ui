<template>
  <div>
    <h3 v-for="(item, i) in gyroscope" :key="i">
      {{item}}
    </h3>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        gyroscope : "sdf",
      }
    },
    created() {
      let sensor = new RelativeOrientationSensor({ frequency: 60 });
      sensor.onreading = (e) => this.gyroscope = e.currentTarget.quaternion
      sensor.start();
    },
  }
</script>

<style lang="scss" scoped>

</style>