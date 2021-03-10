import Vue from 'vue'
import { make, set, dispatch } from 'vuex-pathify'
import * as Colyseus from "colyseus.js";


const server = process.env.VUE_APP_BACKEND

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
}

const mutations = {
  ...make.mutations(state),
}

const getters = {

}

const actions = {

  init({state}) {
    let client = new Colyseus.Client(server);
    client.joinOrCreate("my_room").then(room => {
      reactColyseus(room, state.users, "users")
    })
  },


}



export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

