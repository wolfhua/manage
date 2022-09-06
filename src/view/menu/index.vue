<template>
  <div>
    <Row :gutter="10">
      <Col span="6" :xs="24" :sm="24" :md="10" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <Row type="flex" align="middle" justify="center">
            <ButtonGroup class="simu-btn-group" :class="{ editing: isEdit }">
              <Button size="small" :disabled="isEdit">
                <Dropdown @on-click="addMenu">
                  <span>
                    <Icon type="md-add"></Icon>
                    <span class="simu-dropdown">新增</span>
                    <!-- <Icon type="ios-arrow-down"></Icon> -->
                  </span>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">一级菜单</DropdownItem>
                    <DropdownItem name="child" :disabled="menuData.length === 0"
                      >下级菜单</DropdownItem
                    >
                  </DropdownMenu>
                </Dropdown>
              </Button>
              <Button
                :disabled="isEdit"
                size="small"
                icon="ios-create"
                type="primary"
                @click="editMenu"
                >修改</Button
              >
              <Button
                :disabled="isEdit"
                size="small"
                icon="md-trash"
                type="error"
                @click="deleteMenu"
                >删除</Button
              >
            </ButtonGroup>
          </Row>
          <Tree :data="menuData" @on-select-change="handleTreeChange"></Tree>
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
          <Form
            :disabled="!isEdit"
            ref="form"
            :model="formDate"
            :rules="formRules"
            :label-width="80"
          >
            <FormItem label="菜单标题" prop="name">
              <Input
                v-model="formDate.name"
                placeholder="请输入菜单名称"
              ></Input>
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input
                v-model="formDate.path"
                placeholder="请输入菜单路由"
              ></Input>
            </FormItem>
            <FormItem label="菜单类型">
              <Select v-model="formDate.type" placeholder="请选择菜单类型">
                <Option value="menu">目录</Option>
                <Option value="resouce">资源</Option>
              </Select>
            </FormItem>
            <FormItem label="组件" prop="component">
              <i-input
                v-model="formDate.component"
                placeholder="请输入前端组件名称"
              >
                <span slot="prepend">()=>import('@/view</span>
                <span slot="append">.vue')</span>
              </i-input>
            </FormItem>
            <FormItem label="排序">
              <i-input
                v-model="formDate.sort"
                placeholder="组件默认排序"
              ></i-input>
            </FormItem>
            <FormItem label="面包屑">
              不显示
              <Switch v-model="formDate.hideInBread" />
              显示
            </FormItem>
            <FormItem label="菜单显示">
              不显示
              <Switch v-model="formDate.hideInMenu" />
              显示
            </FormItem>
            <FormItem label="页面缓存">
              是
              <!-- Method 1 -->
              <!-- <i-switch v-model="formDate.notCache"></i-switch> -->
              <!-- Method 2 引入iview-loader -->
              <Switch v-model="formDate.notCache" />
              否
            </FormItem>
            <FormItem label="图标">
              <i-input
                v-model="formDate.icon"
                placeholder="请输入图标"
              ></i-input>
            </FormItem>
            <FormItem label="重定向">
              <i-input
                v-model="formDate.redirect"
                placeholder="重定向组件"
              ></i-input>
            </FormItem>
            <FormItem v-if="isEdit">
              <Button type="primary" @click="submit()">确定</Button>
              <Button style="margin-left: 8px" @click="cancel()">取消</Button>
            </FormItem>
          </Form>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <tables
            ref="tables"
            searchable
            search-place="top"
            :columns="columns"
            v-model="tableData"
            @on-row-edit="handleRowEdit"
            @on-row-remove="handleRowRemove"
            @on-selection-change="handleSelect"
            @searchEvent="handleSearch"
          >
            <template v-slot:table-header>
              <Button @click="handleAdd" class="search-btn" type="primary">
                <Icon type="md-person-add" />&nbsp;&nbsp;添加
              </Button>
            </template>
          </tables>
          <Row type="flex" justify="space-between" align="middle">
            <Col class="ctrls">
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
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { sortObj } from '@/libs/util'
export default {
  name: 'admin-menu',
  components: {
    Tables
  },
  data () {
    return {
      isEdit: false,
      menuType: '',
      selectNode: [],
      menuData: [],
      formDate: {
        name: '',
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
      formRules: {
        name: [
          {
            required: true,
            message: '菜单名称不得为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路由路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ]
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
          search: {
            type: 'input'
          }
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'methods',
          search: {
            type: 'input'
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
      tableData: [],
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100]
    }
  },
  methods: {
    addMenu (type) {
      this.menuType = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true
      } else {
        this.$Message.error('请选择要添加的节点')
      }
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.formDate = { ...this.selectNode[0] }
        this.isEdit = true
      } else {
        this.$Message.error('请选择要修改的节点')
      }
    },
    deleteMenu () {
      if (this.selectNode.length > 0) {
        this.$Modal.confirm({
          title: '确定需要删除吗？',
          content: `即将删除【${this.selectNode[0].title}】菜单`,
          onOk: () => {
            const deleteNode = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(i, 1)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    // 递归执行
                    deleteNode(currentNode.children, node)
                  }
                }
              }
              return tree
            }
            this.menuData = deleteNode(this.menuData, this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择要删除的节点')
      }
    },
    handleTreeChange (item) {
      this.selectNode = item
    },
    initFileds () {
      this.isEdit = false
      // 清空表单数据
      this.$refs.form.resetFields()
      this.formDate = {
        name: '',
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
    },
    submit () {
      // 表单必填数据校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 将formData中的数据赋值到menuData中
          //  a.根据menuType不同，决定插入的数据节点
          //  b.注意tree数据格式化
          const data = {
            ...this.formDate,
            expand: true // 展开节点
          }
          data.title = this.formDate.name
          if (this.menuType === 'bro') {
            // 兄弟节点
            if (this.menuData.length === 0) {
              this.menuData.push(data)
            } else {
              const selectNode = this.selectNode[0]
              const getMenu = (parent, select) => {
                for (let i = 0; i < parent.length; i++) {
                  const item = parent[i]
                  // 去重
                  if (item.name === select.name) {
                    // 排序
                    parent.push(data)
                    parent = sortObj(parent, 'sort')
                    return parent
                  } else {
                    if (item.children && item.children.length > 0) {
                      // 递归执行
                      getMenu(item.children, select)
                    }
                  }
                }
                return parent
              }
              this.menuData = getMenu(this.menuData, selectNode)
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
          } else {
            // 编辑
            const updateTree = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                // 去重
                if (currentNode.nodeKey === node.nodeKey) {
                  // tree[i] = node 这样修改，页面不会刷新
                  tree.splice(i, 1, node)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    // 递归执行
                    updateTree(currentNode.children, node)
                  }
                }
              }
              return tree
            }
            this.menuData = updateTree(this.menuData, data)
            this.$set(this.selectNode, 0, data)
          }
          this.initFileds()
          // 提交数据到后台
        } else {
          this.$Message.error('请先填写必填信息')
        }
      })
    },
    cancel () {
      this.initFileds()
    },
    handleRowEdit () {},
    handleRowRemove () {},
    handleSelect () {},
    handleSearch () {},
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
    handleAdd () { },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
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

<style lang="scss">
@media screen and (max-width: 1200px) {
  .simu-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .simu-dropdown {
      display: none;
    }
  }
}
.simu-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
  &.editing {
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
  }
}
</style>
