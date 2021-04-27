<style lang="scss">
#change-pwd-container {
  .title {
    font-size: $fontTitle;
    font-weight: bold;
  }

  .change-pwd-form {
    position: relative;
    width: 510px;
    max-width: 100%;
    padding: 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .form-item-button-group {
      display: block;
      .el-form-item__content {
        display: flex;
        width: 100%;
        justify-content: center;
        .el-button {
          width: 80px;
        }

        > .el-button {
          margin-right: 20px;
          &:nth-child(n + 2) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div id="change-pwd-container">
    <h3 class="title">
      修改密码
    </h3>
    <el-form
      ref="submitForm"
      :inline="true"
      :model="submitForm"
      label-width="120px"
      label-position="left"
      class="change-pwd-form"
      :rules="rules"
    >
      <el-form-item
        prop="accountName"
        label="账号"
      >
        <el-input
          v-model="submitForm.accountName"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="pwd"
        label="新密码"
      >
        <el-input
          v-model="submitForm.pwd"
          type="password"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="confirmPwd"
        label="确认密码"
      >
        <el-input
          v-model="submitForm.confirmPwd"
          type="password"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item class="form-item-button-group">
        <el-button @click="cancle">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="changePwd"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { IFormValidate } from '@/type'
import { UserModule } from '@/plugins/store/modules'
import { EXButton } from '@/components'
import { Vue, Component } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { changePwd } from '@/api'
import md5 from 'md5'
@Component({
  components: {
    EXButton
  }
})
export default class ChangePWD extends Vue {
  private submitForm: any = {
    pwd: '',
    confirmPwd: ''
  };

  private rules: any;
  constructor() {
    super()

    const validatePass: IFormValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.submitForm.confirmPwd !== '') {
          (this.$refs.submitForm as ElForm).validateField('confirmPwd')
        }
        callback()
      }
    }

    const validateCheckPass: IFormValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.submitForm.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    this.rules = {
      accountName: { required: true },
      oldPwd: [
        { required: true, message: '请输入您的原密码', trigger: 'blur' },
        { min: 6, max: 99, message: '长度在 6 到 99 个字符', trigger: 'blur' }
      ],
      pwd: [
        {
          required: true,
          message: '请输入您的新密码',
          validator: validatePass,
          trigger: 'blur'
        },
        {
          min: 8,
          max: 8,
          message: '密码长度为八位，组合方式不做约束！',
          trigger: 'blur'
        }
      ],
      confirmPwd: [
        { required: true, validator: validateCheckPass, trigger: 'blur' },
        {
          message: '密码长度为八位，组合方式不做约束！',
          trigger: 'blur'
        }
      ]
    }
  }

  protected created() {
    this.submitForm.accountName = UserModule.userInfo.accountName
  }

  protected changePwd() {
    (this.$refs.submitForm as ElForm).validate(async valid => {
      if (valid) {
        await UserModule.changePwd({ pwd: md5(this.submitForm.pwd) })
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } else {
        console.log('error submit!!')
      }
    })
  }

  protected cancle() {
    this.$router.back()
  }
}
</script>
