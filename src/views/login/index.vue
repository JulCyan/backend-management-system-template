<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          后台管理系统模板
        </h3>
      </div>

      <el-form-item prop="accountName">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="accountName"
          v-model="loginForm.accountName"
          name="accountName"
          type="text"
          autocomplete="on"
          placeholder="请输入用户名"
        />
      </el-form-item>

      <el-form-item prop="pwd">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="pwd"
          v-model="loginForm.pwd"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          autocomplete="on"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>

      <div class="form-item-wrap">
        <el-form-item
          prop="verifyCode"
          style="width: 70%"
        >
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input
            ref="verifyCode"
            v-model="loginForm.verifyCode"
            name="verifyCode"
            type="text"
            placeholder="请输入验证码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div
          v-if="verifyCodeImage"
          class="verify-image-wrap"
          @click="getVerifyCode"
        >
          <img
            :src="verifyCodeImage"
            alt=""
          >
        </div>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        登 录
      </el-button>

      <div style="position:relative">
        <div class="tips">
          若忘记密码，请联系管理员
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule, PermissionModule } from '@/plugins/store/modules'
const md5 = require('md5')

@Component({
  name: 'Login'
})
export default class extends Vue {
  private loginForm = {
    accountName: '',
    pwd: '',
    verifyCode: ''
  };
  private loginRules = {
    accountName: [
      { required: true, trigger: 'change', message: '用户名不能为空' }
    ],
    pwd: [{ required: true, trigger: 'change', message: '密码不能为空' }],
    verifyCode: [
      { required: true, trigger: 'change', message: '验证码不能为空' }
    ]
  };
  private passwordType = 'password';
  private loading = false;
  private showDialog = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  protected created() {
    this.getVerifyCode()
  }

  protected mounted() {
    if (this.loginForm.accountName === '') {
      (this.$refs.accountName as Input).focus()
    } else if (this.loginForm.pwd === '') {
      (this.$refs.pwd as Input).focus()
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.pwd as Input).focus()
    })
  }

  protected getVerifyCode() {
    UserModule.GetVerifyCode()
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        try {
          await UserModule.Login({
            ...this.loginForm,
            pwd: md5(this.loginForm.pwd)
          })
          await PermissionModule.AsyncAddRoutes()
          setTimeout(() => {
            this.$router.push({
              path: this.redirect == '/404' ? '/' : this.redirect,
              query: this.otherQuery
            })
          }, 200)
          this.loading = false
        } catch (error) {
          this.loginForm.verifyCode = ''
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  get verifyCodeImage() {
    this.$nextTick(() => {
      (this.$refs['loginForm'] as ElForm).clearValidate('verifyCode')
    })
    return UserModule.verifyCodeImage
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: $lightGray;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }
}
.form-item-wrap {
  display: flex;
  .verify-image-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 30%;
    height: 50px;
    cursor: pointer;
    img {
      height: 46px;
    }
  }
}
</style>
