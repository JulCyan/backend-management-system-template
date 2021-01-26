
declare module '*settings.json' {
    export interface ISettings {
        title: string // Overrides the default title
        showSettings: boolean // Controls settings panel display
        showTagsView: boolean // Controls tagsview display
        showSidebarLogo: boolean // Controls siderbar logo display
        fixedHeader: boolean // If true, will fix the header component
        errorLog: string[] // The env to enable the errorlog component, default 'production' only
        sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
        devServerPort: number // Port number for webpack-dev-server
        remoteServerPort: number // Port number for mock server
        enableProxy: boolean,
        enablePWA: boolean,
        enableRouterInterceptor: boolean
    }
    export const settings: ISettings
    export default settings
}
