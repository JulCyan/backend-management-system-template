
declare module '*styles/_variables.scss' {
  export interface IScssVariables {
    menuBg: string
    menuText: string
    menuActiveText: string
    theme: string
  }

  export const variables: IScssVariables

  export default variables
}
