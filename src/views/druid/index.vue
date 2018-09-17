<template>
  <div class="dashboard-container">
    <el-card :body-style="siteContentViewHeight">
      <iframe
        :src="iframeUrl"
        width="100%" frameborder="0" :height="height" scrolling="yes">
      </iframe>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'druid',
    data() {
      return {
        iframeUrl: 'http://localhost:8082/druid/index.html',
        height: (document.documentElement['clientHeight'] - 50 - 30 - 2) + 'px'
      }
    },
    created() {
      document.title = this.$t('route.' + this.$route.meta.title)
      // this.getTree()
    },
    methods: {
      siteContentViewHeight() {
        var height = document.documentElement['clientHeight'] - 50 - 30 - 2
        return { minHeight: height + 'px' }
      },
      test() {
        var height = document.documentElement['clientHeight'] - 50 - 30 - 2
        console.log(height)
      }
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
