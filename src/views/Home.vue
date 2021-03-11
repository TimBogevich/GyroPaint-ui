<template>
  <div >
    <mobile v-if="isMobile"/>
    <canv v-else/>
  </div>
</template>

<script>
// @ is an alias to /src
import mobile from '@/components/mobile/mobile.vue'
import canv from '@/components/canvas/canvas.vue'

export default {
  components: {
    mobile,
    canv
  },
  computed: {
    isMobile() {
      let d = this.$vuetify.breakpoint.name
      return ["xs", "sm"].includes(d)
    }
  },
}
</script>
