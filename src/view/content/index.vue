<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleEdit"
        @on-row-remove="handleRemove"
        @searchEvent="handleSearchData"
      />
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        class="code-row-bg"
      >
        <Col class="ctrls">
          <!-- <Button @click="handleSelectAll(true)">设置全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button> -->
          <Button style="margin: 10px 0" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出为Csv文件
          </Button>
        </Col>
        <Col>
          <Page
            :current="page"
            :total="total"
            :page-size-opts="pageArr"
            show-sizer
            show-elevator
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          />
        </Col>
      </Row>
    </Card>
    <editModal
      :isShow="showEdit"
      :itemData="itemData"
      @editEvent="handleEditEvent"
      @changeEvent="handleChangeEvent"
    ></editModal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getList, deletePostByid, updatePostByid } from '@/api/content'
import dayjs from 'dayjs'
import editModal from './editModal.vue'
export default {
  name: 'content_management',
  components: {
    Tables,
    editModal
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      option: {},
      pageArr: [10, 20, 30, 50, 100],
      columns: [
        {
          type: 'selection',
          key: 'handle',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 400,
          ellipsis: true,
          tooltip: true,
          search: {
            type: 'input'
          }
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center',
          // 方法二：使用 render 方法结构化数据
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '作者',
          key: 'user',
          width: 120,
          align: 'center',
          // 方法二：使用 render 方法结构化数据
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: 'primary'
                },
                domProps: {
                  innerHTML: params.row.uid.nickname
                }
              })
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask':
                result = '提问'
                break
              case 'advise':
                result = '建议'
                break
              case 'discuss':
                result = '交流'
                break
              case 'share':
                result = '分享'
                break
              case 'logs':
                result = '动态'
                break
              case 'notice':
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', [h('span', result)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '提问',
                value: 'ask'
              },
              {
                key: '建议',
                value: 'advise'
              },
              {
                key: '交流',
                value: 'discuss'
              },
              {
                key: '分享',
                value: 'share'
              },
              {
                key: '公告',
                value: 'notice'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map((o) => o.name).join(',') || '')
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '阅读记数',
          key: 'reads',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isTop === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action', // 与table组件里的slot-scope slot名称相同
          fixed: 'right',
          width: 160,
          align: 'center',
          hidden: true
        }
      ],
      tableData: [],
      showEdit: false,
      currentIndex: 0,
      itemData: {}
    }
  },
  methods: {
    // 改变模态框状态
    handleChangeEvent (value) {
      this.showEdit = value
      this.$Message.info('取消编辑！')
    },
    // 编辑
    handleEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      // 拷贝传递给子组件
      this.itemData = { ...row }
    },
    // 删除
    handleRemove (row, index) {
      console.log(row)
      console.log(index)
      this.$Modal.confirm({
        title: '想好了真的要删除吗？',
        content: `您确认要删除第${index + 1}条，标题为"${row.title}"的数据吗？`,
        onOk: () => {
          deletePostByid(row._id).then(res => {
            if (res.code === 200) {
              // filter过滤数组内容
              this.tableData = this.tableData.filter(item => {
                return item._id !== row._id
              })
              this.$Message.info('删除成功')
            } else {
              this.$Message.error(res.msg)
            }
          }).catch(err => {
            this.$Message.error('删除失败：' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('您取消了删除操作')
        }
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `article-${(new Date()).valueOf()}.csv`
      })
    },
    // 改变页码
    changePage (page) {
      this.page = page
      this.getTabList()
    },
    // 改变每页数量
    changePageSize (size) {
      this.limit = size
      this.getTabList()
    },
    // 获取列表数据
    getTabList () {
      getList({
        page: this.page - 1,
        limit: this.limit,
        ...this.option
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    // 编辑数据保存触发
    handleEditEvent (item) {
      updatePostByid(item).then(res => {
        if (res.code === 200) {
          // 替换列表数据中指定行的值
          // this.tableData[this.currentIndex] = item // 注：这种方式替换数据，dom节点数据不会更新
          this.tableData.splice(this.currentIndex, 1, item)
          console.log('成功')
        }
      })
      this.showEdit = false
    },
    // 搜索
    handleSearchData (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      this.option = {}
      this.page = 1
      // if (
      //   (typeof this.option.search !== 'undefined' &&
      //     value.search !== this.option.search) ||
      //   this.option === {}
      // ) {
      //   this.page = 1 // 从1开始
      // }
      if (value.item === 'tags') {
        value.item = 'tag'
      }
      this.option[value.item] = value.search
      this.getTabList()
    }
  },
  mounted () {
    this.getTabList()
  }
}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
