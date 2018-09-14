<template>
  <div class="app-container">

  </div>
</template>

<script>
  export default {
    name: 'roles',
    data() {
      return {}
    },
    created() {
      document.title = this.$t('route.' + this.$route.meta.title)
      // this.getTree()
    },
    methods: {
    }
  }
</script>
<style scoped>
  .text-content{
    background: rgba(66, 185, 131, 0.2);
    border-radius: 2px;
    padding: 16px;
    padding: 1rem;
    line-height: 1.6rem;
    word-spacing: .05rem;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
