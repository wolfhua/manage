<template>
  <div>
    <Row type="flex" align="middle">
      <i-col class="overtext" span="18">{{ row.param }}</i-col>
      <i-col span="6" v-show="this.row.param">
        <a @click="more" style="padding-left: 6px">详情</a>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    }
  },
  methods: {
    more () {
      if (!this.row.param) {
        return
      }
      this.$Modal.info({
        title: '参数详情',
        // content: JSON.stringify(this.row.param),
        // 此处一样可以使用render
        render: (h, params) => {
          return h('Input', {
            props: {
              // disabled: true,
              type: 'textarea',
              value: JSON.stringify(this.row.param, null, 2),
              rows: 16
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overtext {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
  -webkit-line-clamp: 3; // 显示的行数
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
}
</style>
