<template>
  <div>
    <login v-if="users.length == 0" :url="url" />
    <paint v-else/>
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
        url : "error",
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

</style>