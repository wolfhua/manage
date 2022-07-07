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
        @on-delete="handleDelete"
      />
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        class="code-row-bg"
      >
        <Button style="margin: 10px 0" type="primary" @click="exportExcel"
          >导出为Excel文件</Button
        >
        <Page
          :current="page"
          :total="total"
          :page-size-opts="pageArr"
          show-sizer
          show-elevator
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        />
      </Row>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getList } from '@/api/content'
import dayjs from 'dayjs'
export default {
  name: 'content_management',
  components: {
    Tables
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      columns: [
        {
          type: 'selection',
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
            return h('div', [h('span', params.row.uid.nickname)])
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
          slot: 'action',
          fixed: 'right',
          width: 160,
          align: 'center',
          hidden: true
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
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
    getTabList () {
      getList({
        page: this.page - 1,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    }
  },
  mounted () {
    this.getTabList()
  }
}
</script>

<style>
</style>
