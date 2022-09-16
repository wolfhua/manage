<template>
  <div>
    <Row :gutter="10">
      <Col span="6" :xs="24" :sm="24" :md="10" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <TreeMenu
            :isEdit="isEdit"
            :menu="menuData"
            @addMenuEvent="addMenu"
            @editMenuEvent="editMenu"
            @deleteMenuEvent="deleteMenu"
            @on-select="handleTreeChange"
          ></TreeMenu>
        </Card>
      </Col>
      <Col span="18" :xs="24" :sm="24" :md="14" :lg="18">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px"
        >
          <MenuForm
            :isEdit="isEdit"
            :formData="formData"
            @submit="submit"
            @cancel="initForm"
          ></MenuForm>
        </Card>
        <Card
          :title="$t('resources')"
          icon="md-exit"
          :dis-hover="true"
          :shadow="true"
        >
          <OperationsTable
            :columns="columns"
            :tableData="tableData"
            :isEdit="isEdit"
            @on-change="handleTableChange"
          ></OperationsTable>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

import TreeMenu from './tree.vue'
import MenuForm from './form.vue'
import OperationsTable from './operations.vue'
import { sortObj, deleteNode, insertNode, updateNode, getNode } from '@/libs/util'
import { addMenu, getMenu, updateMenu, deleteMenu } from '@/api/admin'
export default {
  name: 'admin-menu',
  components: {
    TreeMenu,
    MenuForm,
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      menuType: '',
      selectNode: [],
      menuData: [],
      formData: {
        title: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '资源路径',
          key: 'path',
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          }
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
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
      selection: [],
      tableData: []
    }
  },
  mounted () {
    this._getMenu()
  },
  methods: {
    _getMenu () {
      getMenu().then(res => {
        if (res.code === 200) {
          this.menuData = res.data
        } else {
          this.$Message.error('菜单数据获取失败')
        }
      })
    },
    // 增加菜单
    addMenu (type) {
      // 避免有预览数据，添加前，先清空数据
      this.initForm()
      this.menuType = type
      this.isEdit = true
    },
    // 编辑菜单
    editMenu (select) {
      this.isEdit = true
      this.formData = select
    },
    // 删除菜单
    deleteMenu (select) {
      // 判断是删除一级菜单还是子菜单
      const parent = getNode(this.menuData, select)
      if (parent.nodeKey !== select.nodeKey) {
        // 删除子菜单
        updateMenu(parent).then(res => {
          if (res.code === 200) {
            this.$Message.success('子菜单删除成功！')
          } else {
            this.$Message.error('子菜单删除失败！')
          }
        })
      } else {
        deleteMenu({ _id: parent._id }).then(res => {
          if (res.code === 200) {
            this.$Message.success('菜单删除成功！')
          } else {
            this.$Message.error('菜单删除失败！')
          }
        })
      }
      this.menuData = deleteNode(this.menuData, select)
    },
    // 选择节点，加载预览数据
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      if (!this.isEdit) {
        this.selectNode = item
        this.formData = item[0]
        // if (item[0].operations && item[0].operations.length > 0) {
        // this.tableData = item[0].operations
        // 避免tableData数据修改了，form表单数据点击了取消，因此给this.tableData赋一个新值
        this.tableData = [...item[0].operations]
        // }
      } else {
        this.$Message.error('请退出编辑状态后再查看!')
      }
    },
    initForm () {
      this.isEdit = false
      this.formData = {
        title: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.menuType = ''
      // 避免有operations，每次数据添加保存完成后，清空tableData
      this.tableData = []
    },
    // 数据保存
    submit (data) {
      // data.title = this.formDate.name
      // 判断是否增加了资源属性
      if (this.tableData.length > 0) {
        data.operations = this.tableData
      }
      if (this.menuType === 'bro') {
        // 兄弟节点
        if (this.menuData.length === 0) {
          this.menuData.push(data)
          addMenu(data).then(res => {
            if (res.code === 200) {
              this.$Message.success('菜单添加成功！')
            } else {
              this.$Message.error('菜单添加失败！')
            }
          })
        } else {
          const selectNode = this.selectNode[0]
          this.menuData = insertNode(this.menuData, selectNode, data)
          // 两种情况
          const parent = getNode(this.menuData, selectNode)
          // console.warn(parent)
          // console.warn(selectNode)
          if (parent.nodeKey === selectNode.nodeKey) {
            // 1.可能是一级节点添加兄弟节点 -->直接addMenu
            // nodekey是iview tree产生的唯一属性
            addMenu(data).then(res => {
              if (res.code === 200) {
                this.$Message.success('菜单添加成功！')
              } else {
                this.$Message.error('菜单添加失败！')
              }
            })
          } else {
            // 2.可能是子节点添加兄弟节点 -->updateMenu
            // parent = getNode(this.menuData, selectNode)
            updateMenu(parent).then(res => {
              if (res.code === 200) {
                this.$Message.success('菜单添加成功！')
              } else {
                this.$Message.error('菜单添加失败！')
              }
            })
          }
        }
      } else if (this.menuType === 'child') {
        // 子节点
        if (typeof this.selectNode[0].children === 'undefined') {
          // 没有子节点，直接添加
          // vue更新对象数据不能直接修改，直接修改页面不会更新，使用$set()
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [
            ...this.selectNode[0].children,
            data
          ]
          // 排序
          arr = sortObj(arr, 'sort')
          this.$set(this.selectNode[0], 'children', arr)
        }
        const parent = getNode(this.menuData, this.selectNode[0])
        updateMenu(parent).then(res => {
          if (res.code === 200) {
            this.$Message.success('子菜单添加成功！')
          } else {
            this.$Message.error('子菜单添加失败！')
          }
        })
      } else {
        // 编辑
        this.menuData = updateNode(this.menuData, data)
        this.$set(this.selectNode, 0, data)
        const parent = getNode(this.menuData, this.selectNode[0])
        updateMenu(parent).then(res => {
          if (res.code === 200) {
            this.$Message.success('菜单修改成功！')
          } else {
            this.$Message.error('菜单修改失败！')
          }
        })
      }
    },
    handleTableChange (table) {
      this.tableData = table
    }

  }
}
</script>

<style lang="scss">
</style>
