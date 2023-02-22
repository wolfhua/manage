<template>
  <div>
    <Card :dis-hover="true" :shadow="true">
      <Table
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        @on-selection-change="handleSelect"
      ></Table>
      <Row type="flex" justify="space-between" align="middle">
        <i-col class="ctrls">
          <Button @click="_deleteErrors()">批量删除</Button>
        </i-col>
        <i-col>
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
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { deleteErrors, getErrorList } from '@/api/admin'
import dayjs from 'dayjs'
import Expand from './expand.vue'
import More from './more'
export default {
  data () {
    const that = this
    return {
      columns: [
        {
          type: 'expand',
          key: 'stack',
          width: 50,
          render: (h, params) => {
            return h(Expand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '错误消息',
          key: 'message',
          align: 'center',
          minWidth: 180
        },
        {
          title: '错误码',
          key: 'code',
          align: 'center',
          minWidth: 120,
          filters: [], // 开启搜索
          filterMultiple: false, // 禁止多选
          filterRemote: that.filterHandle // 使用远程过滤
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center',
          minWidth: 140,
          filters: [],
          filterMultiple: false,
          filterRemote: that.filterHandle
        },
        {
          title: '请求路径',
          key: 'path',
          align: 'center',
          minWidth: 200
        },
        {
          title: '请求参数',
          key: 'param',
          minWidth: 200,
          render: (h, params) => {
            return h(More, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '日期',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
        },
        {
          title: '用户',
          key: 'username',
          align: 'center',
          minWidth: 120
        }
      ],
      data: [],
      filters: {},
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      loading: true,
      selection: []
    }
  },
  watch: {
    // 监听筛选项
    filters (newval, oldval) {
      // console.log('filters -> newval', newval)
      this._getErrorList()
    }
  },
  mounted () {
    this._getErrorList()
  },
  methods: {
    _deleteErrors () {
      const selection = this.selection
      if (selection.length !== 0) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '确定要删除已选中的错误消息吗？',
          onOk: () => {
            const arr = selection.reduce((obj, item) => {
              // obj.ids = []
              // return obj.ids.push(item._id)
              return [...obj, item._id]
            }, [])
            console.log('deleteError -> arr', arr)
            deleteErrors({ ids: arr }).then((res) => {
              if (res.code === 200) {
                // filter 过滤数组
                this.data = this.data.filter((item) => {
                  if (!arr.includes(item._id)) {
                    return item
                  }
                })
                this.$Message.success('删除成功！')
              } else {
                this.$Message.error('删除失败，请联系管理员！')
              }
            })
          }
        })
      } else {
        this.$Modal.error({
          title: '错误',
          content: '请选择要删除的错误消息'
        })
      }
    },
    filterHandle (value, row) {
      console.log(value)
      const obj = { ...this.filters }
      if (value[0]) {
        obj[row] = value[0]
      } else {
        delete obj[row]
      }
      this.filters = obj
    },
    _getErrorList () {
      getErrorList({
        page: this.page - 1,
        limit: this.limit,
        filter: this.filters || {}
      }).then((res) => {
        this.data = res.data
        this.total = res.total
        this.loading = false
        console.log(res.filters)
        const keys = Object.keys(res.filters)
        this.columns.map(item => {
          if (keys.includes(item.key)) {
            if (item.filters.length === 0) {
              // 没有值才进行赋值
              item.filters = res.filters[item.key]
            }
          }
        })
      })
    },
    onPageChange (num) {
      // 页码
      this.globalFilters.page.num = num
    },
    onPageSizeChange (num) {
      // 每页显示条数
      this.globalFilters.page.limit = num
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
    exportData () {
      this.$refs.table.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
        columns: this.columns1.filter((col, index) => index >= 0),
        data: this.data.filter((data, index) => index >= 0)
      })
    },
    handleSelect (selection) {
      this.selection = selection
    }
  }
}
</script>

<style lang="scss">
.ctrls {
  margin-top: 10px;
  button {
    margin-right: 10px;
  }
}
</style>
