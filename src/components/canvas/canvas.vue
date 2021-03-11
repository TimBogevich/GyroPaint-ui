<template>
  <div v-if="url">
    <login v-if="users.length == 0" :url="url" />
    <paint v-else/>
  </div>
  <div v-else>
    <v-progress-circular
      :size="70"
      id="progress"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
  import login from "./login"
  import paint from "./paint"
  import urljoin from "url-join"
  import {get} from "vuex-pathify"

  export default {
    components: {
      login,
      paint,
    },
    data() {
      return {
        url : null,
      }
    },
    computed: {
      server: get("general/server"),
      protocolHTTP: get("general/protocolHTTP"),
      users: get("general/users")
    },
    async created() {
      let roomId = await this.$store.dispatch("general/createRoom")
      this.url = urljoin(window.location.origin, "join", String(roomId.data))
      this.$store.dispatch("general/init", {roomId: roomId.data, board : true})
    },
  }
</script>

<style lang="scss" scoped>
#progress {
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}
</style>