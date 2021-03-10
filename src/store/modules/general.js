import Vue from 'vue'
import { make, set, dispatch } from 'vuex-pathify'
import * as Colyseus from "colyseus.js";
import axios from "axios"
import urljoin from "url-join"


function reactColyseus(room, state, obj) {
  room.state[obj].onAdd = (item) => {
    item = Vue.observable(item)
    Vue.set(state, state.length, item)
    item.onChange = (change) => {
      let ind = state.findIndex(i => i.id == change.id) 
      Vue.set(state, ind, change)
    };
  }
  room.state[obj].onRemove = (player) => {
    let ind = state.findIndex(i => i.id == player.id) 
    Vue.delete(state, ind)
  }
}

const state = {
  users : [],
  colors : ["black", "red", "yellow", "green", "blue", "purple", "pink", "brown"],
  strokes : [5, 10, 15, 20, 30]
}

const mutations = {
  ...make.mutations(state),
}

const getters = {
  protocolWS() {
    return process.env.VUE_APP_BACKEND_PROTOCOL == "http" ? "ws://" : "wss://"
  },
  protocolHTTP() {
    return process.env.VUE_APP_BACKEND_PROTOCOL == "http" ? "http://" : "https://"
  },
  server() {
    return process.env.VUE_APP_BACKEND
  }
}

const actions = {
  init({state, getters}, options) {
    let client = new Colyseus.Client(urljoin(getters.protocolWS, getters.server));
    client.joinOrCreate(options.roomId, options).then(room => {
      reactColyseus(room, state.users, "users")
    })
  },
  async createRoom({getters}) {
    return await axios.get(urljoin(getters.protocolHTTP, getters.server, "create_room"))
  }


}



export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

