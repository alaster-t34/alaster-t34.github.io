import type { LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Alastor-t34',
  subtitle: 'Code · Research · Notes',
  lang: 'zh_CN',
  themeColor: { hue: 205, fixed: false },
  banner: {
    enable: true,
    src: 'assets/images/bannerdd.jpg',
    position: 'center',
    credit: { enable: false, text: '', url: '' },
  },
  toc: { enable: true, depth: 2 },
  favicon: [{ src: '/favicon/icon.jpg', sizes: '32x32' }],
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    { name: '分类', url: '/categories/' },
    { name: '项目', url: '/projects/' },
    { name: '研究', url: '/research/' },
    LinkPreset.About,
    { name: '链接', url: '/links/' },
    { name: 'GitHub', url: 'https://github.com/alaster-t34', external: true },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.jpg',
  name: 'Alaster-t34',
  bio: '再见了，所有的无名之神',
  links: [
    { name: 'GitHub', icon: 'fa6-brands:github', url: 'https://github.com/alaster-t34' },
    { name: 'Steam', icon: 'fa6-brands:steam', url: 'https://steamcommunity.com/' },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
