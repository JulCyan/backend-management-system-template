<style scoped lang="scss">
#header-default-container {
  .h-left {
    float: left;
    margin-left: 40px;
    font-size: 16px;
    line-height: $headerHeight;
    color: #fff;
    cursor: pointer;
  }

   .g-right {
     float: right;
     line-height: $headerHeight;
       cursor: pointer;

     color: #fff;
     .user-name {
       display: inline-block;
       margin-right: 5px;
       color: #fff;
     }

     .el-icon-caret-bottom {
       color: #fff;
     }
   }

   .right-menu {
    float: right;
    height:  $headerHeight;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      vertical-align: text-bottom;

    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="header-default-container">
    <div
      class="h-left"
      @click="home"
    >
      后台管理系统模板
    </div>
    <div class="g-right">
      <div class="right-menu">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div>
            <div class="user-name">
              {{ username }}
            </div>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/armour/vue-typescript-admin-template/"
          >
            <el-dropdown-item>
              Github
            </el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://armour.github.io/vue-typescript-admin-docs/"
          >
            <el-dropdown-item>
              Docs
            </el-dropdown-item>
          </a> -->
            <!-- <el-dropdown-item divided> -->
            <el-dropdown-item>
              <span
                style="display:block;"
                @click="changePwd"
              >修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span
                style="display:block;"
                @click="logout"
              >退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { MixinBase } from '@/mixins'
import { UserModule } from '@/plugins/store/modules/user'
@Component
export default class HeaderDefault extends Mixins(MixinBase) {
  private async logout() {
    await UserModule.LogOut()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }

  private changePwd() {
    this.$router.push(`/change-pwd`)
  }

  get username() {
    return UserModule.userInfo.accountName
  }
}
</script>
