<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created() {
    document.title = this.$t('route.' + this.$route.meta.title)
    if (!this.permissions.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
