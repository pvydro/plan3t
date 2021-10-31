<template>
  <div id="wrapper">
    <iframe id="game-frame" src="http://localhost:8080/" frameborder="0"></iframe>

    <WelcomeModal />
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import WelcomeModal from './components/WelcomeModal.vue'

export default {
  name: 'App',
  components: {
    WelcomeModal
  },
  setup() {
    onMounted(() => {
      const introLogStyle = computed(() => { return `
        font-size: 150%; margin: 2px; padding: 3px 12px; 
        border-radius: 5px; color: #2a9fd6; background: #060606;`})
      const gameFrame = computed(() => { return document.getElementById('game-frame') })

      console.log('%cPLAN3T', introLogStyle.value)

      return { introLogStyle, gameFrame }
    })
  }
}
</script>

<style>

* {
  padding: 0px;
  margin: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #2a2a2a;
}

#wrapper {
  width: 100vw;
  height: 100vh;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
