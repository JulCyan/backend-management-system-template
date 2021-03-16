import { getCurrAccount, login, logout, getVerifyCode, changePwd } from '@/api'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { instance } from '@/plugins/axios'
import { getToken, setToken, removeToken } from '@/plugins/cookies'
import store from '@/plugins/store'
import { Utils } from '@/plugins/utils'

export interface IUserState {
  token: string;
  userInfo: any;
  verifyCodeImage: any;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public userInfo: any = {}
  public verifyCodeImage = null

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = userInfo
  }

  @Mutation
  private SET_VERIFYCODEIMAGE(verifyCodeImage) {
    this.verifyCodeImage = verifyCodeImage
  }

  @Action
  public GetVerifyCode() {
    const utils = new Utils()
    instance(
      getVerifyCode()
    ).then(response => {
      this.SET_VERIFYCODEIMAGE(utils.arrayBufferToBase64(response.data))
    })
  }

  @Action
  public async Login(submitForm: { accountName: string; pwd: string; verifyCode: string }) {
    let { accountName } = submitForm
    accountName = accountName.trim()
    const { data, code }: any = await instance(login({ ...submitForm, accountName }))
    if (code != 200) {
      this.GetVerifyCode()
      return Promise.reject(new Error('Unequal 200 Error'))
    }
    setToken(data.token)
    this.SET_TOKEN(data.token)
    this.SET_USERINFO(data)
  }

  @Action
  public async getUserInfo() {
    const { data } = await instance(getCurrAccount())
    this.SET_USERINFO(data)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_USERINFO({})
  }

  @Action
  public async LogOut() {
    await instance(logout())
    this.ResetToken()
  }

  @Action
  public async changePwd(data) {
    await instance(changePwd(data))
    this.ResetToken()
  }
}

export const UserModule = getModule(User)
