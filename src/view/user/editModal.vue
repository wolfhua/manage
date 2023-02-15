<template>
  <div>
    <Modal
      v-model="showStatus"
      title="编辑用户信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form
        :model="localItem"
        :label-width="80"
        :rules="ruleValidate"
        ref="table"
      >
        <FormItem label="用户昵称" prop="nickname">
          <i-input
            v-model="localItem.nickname"
            placeholder="请输入用户昵称"
          ></i-input>
        </FormItem>
        <FormItem label="登录名" prop="username">
          <i-input
            v-model="localItem.username"
            placeholder="请输入登录名"
          ></i-input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <i-input
            type="password"
            v-model="localItem.password"
            placeholder="请输入密码"
          ></i-input>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select v-model="localItem.roles" multiple>
            <Option
              v-for="(item, index) in roles"
              :value="item.role"
              :key="'roles-' + index"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否是VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户积分" prop="favs">
          <i-input v-model="localItem.favs" style="width: 120px"></i-input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUsername } from '@/api/admin'

const favPassCheck = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户积分'))
  }
  if (!/^[1-9]\d*$/.test(value)) {
    return callback(new Error('请输入正确的数值'))
  }
  const result = parseInt(value)
  if (result % 5 === 0) {
    callback()
  } else {
    callback(new Error('请输入5的倍数'))
  }
}

export default {
  name: 'content_edit-modal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => { }
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    item (newval, oldval) {
      console.log(newval)
      this.localItem = { ...newval }
    },
    isShow () {
      this.showStatus = this.isShow
    }
  },
  computed: {
  },
  data () {
    const userNamePassCheck = (rule, value, callback) => {
      checkUsername({
        id: this.localItem._id,
        username: value
      }).then((res) => {
        if (res.code === 200) {
          const data = res.data
          if (data === 1) {
            // 校验通过
            callback()
          } else if (data === 0) {
            // 校验失败
            callback(new Error('登录用户名已被占用！'))
          }
        }
      })
    }
    return {
      showStatus: false,
      localItem: {
        _id: '',
        nickname: '',
        username: '',
        password: '',
        roles: [],
        status: '0',
        favs: 100,
        isVip: '0'
      },
      tagsList: [],
      loading: true,
      ruleValidate: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 4, message: '昵称长度至少为4位', trigger: 'change' },
          { type: 'string', max: 16, message: '昵称长度不能超过16位', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'email', message: '请检查邮箱格式', trigger: 'blur' },
          { validator: userNamePassCheck.bind(this), trigger: 'blur' }
        ],
        roles: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度至少为6位', trigger: 'change' },
          { type: 'string', max: 20, message: '密码长度不能超过20位', trigger: 'change' }
        ],
        favs: [
          // { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: favPassCheck, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // this._getTags()
  },
  methods: {
    // 获取标签列表
    _getTags () {
      getTags().then((res) => {
        if (res.code === 200) {
          this.tagsList = res.data
        }
      })
    },
    ok () {
      this.$refs.table.validate((valid) => {
        // console.warn(valid)
        // if (valid) {
        //   this.loading = false
        //   // this.$refs.table.resetFields()
        //   this.$emit('changeEvent', false)
        //   this.$emit('editEvent', this.localItem)
        //   this.$Message.info('编辑成功！')
        // } else {
        //   console.log(123)
        //   // this.loading = false
        //   // this.$emit('changeEvent', false)
        //   // this.$nextTick(() => (this.loading = true))
        //   this.$Message.error('请检查输入数据')
        // }
        if (!valid) {
          this.$Message.error('请检查输入数据')
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 500)
          return
        }
        this.loading = false
        this.$emit('changeEvent', false)
        this.$emit('editEvent', this.localItem)
        this.$Message.info('编辑成功！')
      })
      // this.$emit('editEvent', this.localItem)
      // this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消编辑！')
    }
  }
}
</script>
