<template>
  <div>
    <Row
      type="flex"
      align="middle"
      justify="center"
      style="margin-bottom: 10px"
    >
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
  </div>
</template>

<script>
export default {
  name: 'menu-tree',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectNode: []
    }
  },
  methods: {
    addMenu (type) {
      this.menuType = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$emit('addMenuEvent', type)
      } else {
        this.$Message.error('请选择要添加的节点')
      }
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.$emit('editMenuEvent', { ...this.selectNode[0] })
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
            this.$emit('deleteMenuEvent', this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择要删除的节点')
      }
    },
    handleTreeChange (item) {
      this.selectNode = item
      this.$emit('on-select', item)
    }
  },
  computed: {
    menuData () {
      return this.menu
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
