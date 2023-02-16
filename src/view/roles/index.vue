<template>
  <div>
    <Row :gutter="10">
      <i-col span="5" :xs="24" :sm="24" :md="12" :lg="5">
        <Card
          :dis-hover="true"
          :shadow="true"
          title="角色列表"
          icon="md-contacts"
          style="margin-bottom: 10px"
        >
          <!-- <p slot="title">
            <Icon type="md-contacts"></Icon>
            角色列表
          </p> -->
          <a
            href="#"
            slot="extra"
            @click.prevent="addRoleModel()"
            v-if="!isEdit"
          >
            <Icon type="md-add"></Icon>
            新增
          </a>
          <ul class="simu-card">
            <li
              v-for="(item, index) in roles"
              :key="index"
              class="flex"
              :class="{ selected: roleIndex === index }"
              @click="selectRole(index)"
            >
              <div class="flex1 round">{{ item.name }}</div>
              <span>
                <Icon
                  type="ios-create"
                  size="16"
                  color="#2d8cf0"
                  @click.stop="editLabel(item, index)"
                ></Icon>
                <Icon
                  type="md-build"
                  size="16"
                  color="#2d8cf0"
                  @click.stop="editRole(item, index)"
                ></Icon>
                <Icon
                  type="md-trash"
                  size="16"
                  color="#ed4014"
                  @click.stop="_deleteRole(item, index)"
                ></Icon>
              </span>
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="6" :xs="24" :sm="24" :md="12" :lg="6">
        <Card
          :dis-hover="true"
          :shadow="true"
          title="菜单权限"
          icon="md-menu"
          style="margin-bottom: 10px"
        >
          <!-- <p slot="title">
            <Icon type="md-contacts"></Icon>
            角色列表
          </p> -->
          <div href="#" slot="extra">
            <ButtonGroup class="imooc-btn-group" v-if="isEdit">
              <Button
                size="small"
                icon="ios-create"
                type="primary"
                @click="submit()"
                >确定</Button
              >
              <Button size="small" icon="md-trash" @click="cancel()"
                >取消</Button
              >
            </ButtonGroup>
          </div>
          <Tree
            :data="menuData"
            show-checkbox
            @on-select-change="handleTreeChange"
            @on-check-change="handleTreeChecked"
          ></Tree>
        </Card>
      </i-col>
      <i-col span="13" :xs="24" :sm="24" :md="24" :lg="13">
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
      </i-col>
    </Row>
    <Modal
      v-model="showAdd"
      title="添加角色"
      @on-ok="modelSubmit()"
      @on-cancel="modelCancel()"
      :loading="loading"
    >
      <Form :model="formItem" :label-width="80" :rules="formRules" ref="form">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色编码" prop="role">
          <Input v-model="formItem.role" placeholder="请输入角色编码"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="desc">
          <Input v-model="formItem.desc" placeholder="请输入角色描述"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import OperationsTable from './operations.vue'
import { getMenu, getRoles, addRole, updateRole, deleteRole } from '@/api/admin'
import { modifyNode, getPropertyIds } from '@/libs/util'
export default {
  name: 'admin-role',
  components: {
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      showAdd: false,
      modelEdit: false,
      editIndex: '', // 编辑索引
      loading: true,
      roles: [
        // {
        //   name: '超级管理员',
        //   role: 'super_admin',
        //   menu: ['631d77ddc5eff8cbae500df1', '6362189740f17d6cd97fc2d3']
        // }
      ],
      roleIndex: '',
      formItem: {
        name: '',
        role: '',
        desc: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        role: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
      },
      menuData: [
        // {
        //   title: 'parent 1',
        //   expand: true,
        //   children: [
        //     {
        //       title: 'parent 1-1',
        //       expand: true,
        //       children: [
        //         {
        //           title: 'leaf 1-1-1'
        //         },
        //         {
        //           title: 'leaf 1-1-2'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'parent 1-2',
        //       expand: true,
        //       children: [
        //         {
        //           title: 'leaf 1-2-1'
        //         },
        //         {
        //           title: 'leaf 1-2-1'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      selectNode: [],
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
        }
      ],
      tableData: []
    }
  },
  mounted () {
    this._getMenu()
    this._getRoles()
  },
  methods: {
    // 获取菜单
    _getMenu () {
      getMenu().then(res => {
        if (res.code === 200) {
          this.menuData = res.data
          // 缓存数据到本地，便于编辑取消时数据还原
          localStorage.setItem('menuData', JSON.stringify(this.menuData))
        } else {
          this.$Message.error('菜单数据获取失败')
        }
      })
    },
    // 获取角色
    _getRoles () {
      getRoles().then(res => {
        if (res.code === 200) {
          this.roles = res.data
        } else {
          this.$Message.error('权限数据获取失败')
        }
      })
    },
    // 添加角色
    addRoleModel () {
      this.showAdd = true
    },
    // 编辑角色
    editLabel (item, index) {
      this.showAdd = true
      this.modelEdit = true
      this.editIndex = index
      this.formItem = { ...item }
    },
    // 选择角色
    selectRole (index) {
      if (this.roleIndex === '' || this.roleIndex !== index) {
        this.roleIndex = index
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        // this.roleIndex = ''
        if (this.roles[this.roleIndex].menu.length === 0) {
          return
        }
        // 修改右侧菜单树 + 资源选项的选中状态
        // console.log(this.roles[this.roleIndex].menu)
        const tmpData = modifyNode(this.menuData, this.roles[this.roleIndex].menu, 'checked', true)
        // console.log('🚀 ~ file: index.vue:310 ~ selectRole ~ tmpData', tmpData)
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    // 编辑角色
    editRole (item, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    // 删除角色
    _deleteRole (item, index) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${item.name}的角色？`,
        onOk: () => {
          deleteRole({ _id: item._id }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功！')
            }
          })
          this.roles.splice(index, 1)
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 更新角色权限
    submit () {
      this.isEdit = false
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
      // 获取权限id集合
      // this.roles[this.roleIndex].menu = getPropertyIds(this.menuData, ['children', 'operation'])
      const menus = getPropertyIds(this.menuData, ['children', 'operations'])
      const tmp = { ...this.roles[this.roleIndex] }
      tmp.menu = menus
      // 更新页面视图
      this.roles.splice(this.roleIndex, 1, tmp)
      updateRole(tmp).then(res => {
        if (res.code === 200) {
          this.$Message.success('更新角色权限成功!')
        }
      })
    },
    cancel () {
      this.isEdit = false
      const tmpData = localStorage.getItem('menuData')
      if (typeof tmpData !== 'undefined') {
        this.menuData = JSON.parse(tmpData)
        this.tableData = []
        this.selectNode = []
      }
    },
    // 角色信息提交
    modelSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.modelEdit) {
            const roleData = { _id: this.roles[this.editIndex]._id, ...this.formItem }
            updateRole(roleData).then(res => {
              if (res.code === 200 && res.data.modifiedCount === 1) {
                this.$Message.success('更新成功！')
                this.roles.splice(this.editIndex, 1, roleData)
              }
            })
          } else {
            // 提交数据到后台
            addRole(this.formItem).then(res => {
              if (res.code === 200 && res.data.name !== '') {
                this.roles.push(res.data)
                this.$Message.info('添加成功！')
              }
            })
          }

          this.initForm()
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请先填写必填信息')
        }
      })
    },
    // 初始化表单
    initForm () {
      this.loading = false
      this.showAdd = false
      this.modelEdit = false
      setTimeout(() => {
        this.$refs.form.resetFields()
      }, 0)
    },
    modelCancel () {
      this.initForm()
    },
    // 选择菜单树
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }

      this.selectNode = item
      // if (item[0].operations && item[0].operations.length > 0) {
      // this.tableData = item[0].operations
      // 避免tableData数据修改了，form表单数据点击了取消，因此给this.tableData赋一个新值
      this.tableData = [...item[0].operations]
      // }
    },
    handleTreeChecked (item) {
      if (!this.isEdit) {
        const menuData = localStorage.getItem('menuData')
        if (typeof menuData !== 'undefined') {
          this.menuData = JSON.parse(menuData)
        }
        this.$Message.error('无法修改，请选择权限进行编辑')
      }
    },
    handleTableChange (table) {
      // console.log('🚀 ~ file: index.vue:377 ~ handleTableChange ~ table', table)
      // this.tableData = table
      const ids = table.map(o => o._id)
      console.log(this.selectNode)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach((item) => {
          if (!ids.includes(item._id)) {
            item._checked = false
          } else {
            item._checked = true
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.simu-card {
  li {
    list-style: none;
    margin-left: -4px;
  }
  span {
    display: none;
    i {
      margin-left: 3px;
    }
  }
  .flex {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row nowrap;
    &:hover {
      span {
        display: block;
      }
      .flex1 {
        background-color: #eaf4fe;
      }
    }
    .flex1 {
      // flex: 1;
    }
    .round {
      padding: 0 4px;
      border-radius: 3px;
    }
    &.selected {
      .flex1 {
        background-color: #d5e8fc;
      }
    }
  }
}
</style>
