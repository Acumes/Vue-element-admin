<template>
  <div class="app-container">
    <p class="warn-content">
      {{$t('guide.description')}}
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.
      </a>
    </p>
    <el-button icon='el-icon-question' type="primary" @click.prevent.stop="guide">{{$t('guide.button')}}</el-button>
  </div>
</template>

<script>
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './defineSteps'
import steps_zh from './defineSteps_zh'

export default {
  name: 'guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      if (this.$store.getters.language === 'en') {
        this.driver.defineSteps(steps)
      } else {
        this.driver.defineSteps(steps_zh)
      }
      this.driver.start()
    }
  }
}
</script>
