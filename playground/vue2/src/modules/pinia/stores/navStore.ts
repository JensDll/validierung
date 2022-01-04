import { defineStore } from 'pinia'

export const useNavStore = defineStore('navStore', {
  state() {
    return {
      isHidden: true
    }
  },
  actions: {
    toggleNav() {
      this.isHidden = !this.isHidden
    }
  }
})
