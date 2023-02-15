<template>
  <div>
    <tables
      ref="tables"
      :columns="columns"
      v-model="localData"
      @on-selection-change="handleSelect"
    >
      <template v-slot:table-header v-if="isEdit">
        <Button @click="handleAdd" class="search-btn" type="primary">
          <Icon type="md-person-add" />&nbsp;&nbsp;添加
        </Button>
      </template>
    </tables>
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Page
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageArr"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'

export default {
  name: 'menu-operations',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tables
  },
  data () {
    return {
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100],
      selection: [],
      current: 0,
      localData: []
    }
  },
  // computed: {
  //   localData: {
  //     get: function () { return this.tableData },
  //     set: function (value) {
  //       console.log('🚀 ~ file: operations.vue ~ line 83 ~ value', value)
  //     }
  //   }
  // },
  watch: {
    tableData (newval, oldval) {
      localStorage.setItem('localData', JSON.stringify(newval))
      this.localData = newval
    }
  },
  methods: {
    handleSelect (selection) {
      this.selection = selection
      this.$emit('on-change', selection)
      if (!this.isEdit) {
        setTimeout(() => {
          const tmpData = localStorage.getItem('localData')
          if (typeof tmpData !== 'undefined') {
            this.localData = JSON.parse(tmpData)
          }
          this.$Message.error('无法修改，请选择权限进行编辑')
        }, 0)
      }
    },
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
