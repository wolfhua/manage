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
          <a href="#" slot="extra" @click.prevent="changeLimit">
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
              <div class="flex1 round">{{ item.title }}</div>
              <span>
                <Icon type="md-build" size="18" color="#2d8cf0"></Icon>
                <Icon type="md-trash" size="18" color="#ed4014"></Icon>
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
          <Tree :data="menuData" show-checkbox></Tree>
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
  </div>
</template>

<script>
import OperationsTable from '@/view/menu/operations.vue'
export default {
  name: 'admin-role',
  components: {
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      roles: [
        {
          title: 'parent1'
        },
        {
          title: 'parent2'
        },
        {
          title: 'parent3'
        },
        {
          title: 'parent4'
        },
        {
          title: 'parent5'
        }
      ],
      roleIndex: '',
      menuData: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
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
  methods: {
    selectRole (index) {
      if (this.roleIndex === '' || this.roleIndex !== index) {
        this.roleIndex = index
      } else {
        this.roleIndex = ''
      }
    },
    addMenu () { },
    editMenu () { },
    deleteMenu () { },
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      if (!this.isEdit) {
        this.selectNode = item
        // if (item[0].operations && item[0].operations.length > 0) {
        // this.tableData = item[0].operations
        // 避免tableData数据修改了，form表单数据点击了取消，因此给this.tableData赋一个新值
        this.tableData = [...item[0].operations]
        // }
      } else {
        this.$Message.error('请退出编辑状态后再查看!')
      }
    },
    handleTableChange (table) {
      this.tableData = table
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
    i:first-child {
      margin-right: 6px;
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
