<template>
  <div>
    <tables
      ref="tables"
      searchable
      search-place="top"
      :columns="columns"
      v-model="localData"
      @on-row-edit="handleRowEdit"
      @on-row-remove="handleRowRemove"
      @on-selection-change="handleSelect"
      @searchEvent="handleSearch"
    >
      <template v-slot:table-header v-if="isEdit">
        <Button @click="handleAdd" class="search-btn" type="primary">
          <Icon type="md-person-add" />&nbsp;&nbsp;添加
        </Button>
      </template>
    </tables>
    <Row type="flex" justify="space-between" align="middle">
      <Col class="ctrls" v-if="isEdit">
        <Button @click="handleDeleteBatch()">批量删除</Button>
        <Button @click="handleSetBatch()">批量设置</Button>
      </Col>
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
    <AddModel
      :isShow="showModel"
      :isEdit="showEdit"
      :item="selectItem"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></AddModel>
    <BatchSet
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddModel from './operations/add'
import BatchSet from './operations/set'
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
    Tables,
    AddModel,
    BatchSet
  },
  data () {
    return {
      showModel: false,
      showEdit: false,
      showSet: false,
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100],
      selectItem: {},
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
    localData () {
      this.$emit('on-change', this.localData)
    },
    tableData (newval, oldval) {
      this.localData = newval
    }
  },
  methods: {
    handleRowEdit (item, index) {
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，无法进行修改！')
        return
      }
      this.selectItem = item
      this.current = index
      this.showEdit = true
      this.showModel = true
    },
    handleRowRemove (row, index) {
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，无法进行删除！')
        return
      }
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${row.name}的名称，请求路径${row.path}资源？`,
        onOk: () => {
          this.localData.splice(index, 1)
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleSearch () { },
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${msg}的资源`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)

          // this.localData.splice(index, 1)
          this.localData = this.localData.filter(
            (item) => !arr.includes(item.name)
          )
          this.$Message.success('删除成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleAdd () {
      this.showModel = true
    },
    handleItemAdd (item) {
      if (this.showEdit) {
        this.localData.splice(this.current, 1, item)
        this.showEdit = false
      } else {
        this.localData.push(item)
      }
    },
    // 批量设置模态框
    handleItemSet (settings) {
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定设置吗？',
        content: `修改${msg}的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          // this.tableData.splice(index, 1)
          this.localData.map((item, index) => {
            const tmp = { ...item }
            if (arr.includes(tmp.name)) {
              for (var keys of Object.keys(settings)) {
                tmp[keys] = settings[keys]
              }
              this.$set(this.localData, index, tmp)
            }
          })
          this.$Message.success('批量设置成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleAddChangeEvent (value) {
      this.showModel = value
      this.showEdit = value
      this.selectItem = {}
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
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
