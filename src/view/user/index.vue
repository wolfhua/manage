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
        @on-selection-change="handleSelect"
        @searchEvent="handleSearchData"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary">
            <Icon type="md-person-add" />&nbsp;&nbsp;新增用户
          </Button>
        </template>
      </tables>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        class="code-row-bg"
      >
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
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
      :item="itemData"
      @editEvent="handleEditEvent"
      @changeEvent="handleChangeEvent"
    ></editModal>
    <AddModel
      :isShow="showAdd"
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
import editModal from './editModal'
import AddModel from './add'
import BatchSet from './batchSet'
import { getUserList, updateUserById, deleteUserById, addUser, updateUserBatchById } from '@/api/admin'
import dayjs from 'dayjs'
export default {
  name: 'user_management',
  components: {
    Tables,
    editModal,
    AddModel,
    BatchSet
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
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'nickname',
          minWidth: 140,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 180,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            // const roleNames = params.row.roles
            //   .map((o) => this.roleNames[o])
            //   .join(',')
            // return h('div', [h('span', roleNames)])
            return h('div', [
              h('span', params.row.roles.join(','))
            ])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true,
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 180,
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
          title: '设置',
          key: 'settings',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 100,
          align: 'center'
        }
      ],
      tableData: [],
      selection: [],
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentIndex: 0,
      itemData: {}
    }
  },
  methods: {
    handleSelect (selection) {
      this.selection = selection
    },
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteUserById(arr).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData = this.tableData.filter(
              (item) => !arr.includes(item._id)
            )
            this.$Message.success('删除成功！')
            //  this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 改变模态框状态--编辑
    handleChangeEvent (value) {
      this.showEdit = value
    },
    // 编辑
    handleEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      // 拷贝传递给子组件
      this.itemData = { ...row }
    },
    handleAddUser () {
      this.showAdd = true
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
    handleItemAdd (item) {
      addUser(item).then((res) => {
        if (res.code === 200) {
          console.log('更新成功')
          // this.tableData[this.currentIndex] = item
          this.tableData.splice(0, 0, res.data)
        }
      })
    },
    // 删除
    handleRemove (row, index) {
      console.log(row)
      console.log(index)
      this.$Modal.confirm({
        title: '你说儿豁',
        content: `确认删除${row.nickname}这个老六？`,
        onOk: () => {
          deleteUserById(row._id).then(res => {
            if (res.code === 200) {
              // filter过滤数组内容
              // 方式一
              // this.tableData = this.tableData.filter(item => {
              //   return item._id !== row._id
              // })
              // 方式二
              this.tableData.splice(index, 1)
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
        filename: `user-${(new Date()).valueOf()}.csv`
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
    handleSearchData (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      if (
        (typeof this.option.search !== 'undefined' &&
          value.search !== this.option.search) ||
        this.option === {}
      ) {
        this.page = 1 // 从1开始
      }
      this.option = value
      this.getTabList()
    },
    // 获取列表数据
    getTabList () {
      getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    // 编辑数据保存触发
    handleEditEvent (item) {
      updateUserById(item).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, item)
          console.log('成功')
        }
      })
      this.showEdit = false
    },
    // 批量设置
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    // 批量设置模态框
    handleItemSet (settings) {
      // console.log('handleItemSet -> settings', settings)
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定修改用户吗？',
        content: `修改${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          updateUserBatchById({ ids: arr, settings }).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData = this.tableData.map((item) => {
              if (arr.includes(item._id)) {
                for (var keys of Object.keys(settings)) {
                  item[keys] = settings[keys]
                }
              }
            })
            this.$Message.success('批量更新成功！')
            //  this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
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
