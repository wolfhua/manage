<template>
  <div>
    <Row>
      <i-col span="24">
        <p>请求路径：{{ row.path }} - {{ row.method }} - {{ row.code }}</p>
        <p>请求参数：{{ row.param }}</p>
      </i-col>
      <i-col span="24">
        <p>Stack:</p>
        <p>{{ row.stack }}</p>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'expand',
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
