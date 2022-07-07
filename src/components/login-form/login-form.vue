<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Input
        class="simu-input"
        type="text"
        v-model="form.code"
        placeholder="请输入验证码"
      >
        <span slot="prepend">
          <Icon :size="14" type="md-image"></Icon>
        </span>
        <span
          class="simu-code"
          slot="append"
          v-html="svg"
          @click="getCode"
        ></span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getCaptch } from '@/api/login'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'change' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度最少6位', trigger: 'change' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'string', len: 4, message: '验证码长度4位', trigger: 'change' }
        ]
      }
    }
  },
  data () {
    return {
      svg: '',
      form: {
        username: '',
        password: '',
        code: '',
        sid: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  mounted () {
    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuidv4()
      localStorage.setItem('sid', sid)
    }
    // 提交设置sid到store
    this.$store.commit('setSid', sid)
    this.form.sid = sid
    this.getCode()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', { ...this.form })
        }
      })
    },
    getCode () {
      getCaptch({ sid: this.$store.state.sid }).then((res) => {
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss">
.simu-input {
  .ivu-input-group-append {
    padding: 0;
  }
  // .ivu-input-group-prepend {
  //   width: 32px;
  // }
}
.simu-code {
  height: 28px;
  display: inline-block;
  overflow: hidden;
  svg {
    width: 120px;
    height: 32px;
    position: relative;
    top: -2px;
  }
}
</style>
