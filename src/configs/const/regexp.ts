
// RegExp -------------------------------------------------------
export const RegPhone = /^1[3456789][0-9]\d{8}$/
export const RegName = /^[\u2E80-\u9FFF]+$/
export const RegEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
export const RegQQ = /^[1-9]\d{5,11}$/
export const RegWeChat = /micromessenger/
export const RegIdCard = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
export const RegBankCard = /[1-9]\d{14,17}/
// 数字字母混合
export const RegPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/
// 网站
export const RegHttpsLink = /^(https?:|mailto:|tel:)/
// key(:key)*
export const RegKeys = /^[A-Za-z]+(:[A-Za-z]+)*$/
