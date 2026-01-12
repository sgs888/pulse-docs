export interface Md5LoginInfo {
  username: string;
  password: string;
}

export enum PulseLoginType {
  md5 = 'md5',
  express = 'express'
}

export interface PulsePrivate {
  isTeek: boolean;
  type: PulseLoginType;
  md5LoginInfos?: Md5LoginInfo[];
}

export enum CursorTheme {
  Default = 'default',
  Custom = 'custom',
  Mac = 'mac',
  PaperFold = 'paperFold',
  Kronii = 'kronii',
  BlackWukong = 'blackWukong',
  PaperPlane = 'paperPlane',
  WaterDrop = 'waterDrop',
  XiaMu = 'xiaMu',
  Retro = 'retro',
  AngryBirds = 'angryBirds',
  BlueFl = 'blueFl',
  Ink = 'ink',
}
export type CursorThemeValue = `${CursorTheme}`;
export interface CursorConfig {
  label: string;
  value: CursorTheme;
  icon?: string;
}

import defaultIcon from '@/theme/cursors/other/default.svg';
import macIcon from '@/theme/cursors/mac/default.png';
import paperIcon from '@/theme/cursors/paperFold/default.png';
import kroniiIcon from '@/theme/cursors/kronii/default.png';
import blackWukongIcon from '@/theme/cursors/blackWukong/default.png';
import paperPlaneIcon from '@/theme/cursors/paperPlane/default.png';
import waterDropIcon from '@/theme/cursors/waterDrop/default.png';
import xiaMuIcon from '@/theme/cursors/xiaMu/default.png';
import retroIcon from '@/theme/cursors/retro/default.png';
import birdsIcon from '@/theme/cursors/angryBirds/default.png';
import blueFlIcon from '@/theme/cursors/blueFl/default.png';
import inkIcon from '@/theme/cursors/ink/default.png';
export const cursorList: CursorConfig[] = [
  { label: '默认', value: CursorTheme.Default, icon: defaultIcon },
  { label: '折纸', value: CursorTheme.PaperFold, icon: paperIcon },
  { label: '纸飞机', value: CursorTheme.PaperPlane, icon: paperPlaneIcon },
  { label: '水滴', value: CursorTheme.WaterDrop, icon: waterDropIcon },
  // { label: 'MacOS', value: CursorTheme.Mac, icon: macIcon },
  { label: '奥罗克洛尼', value: CursorTheme.Kronii, icon: kroniiIcon },
  { label: '黑神话悟空', value: CursorTheme.BlackWukong, icon: blackWukongIcon },
  { label: '愤怒的小鸟', value: CursorTheme.AngryBirds, icon: birdsIcon },
  { label: '良口三三', value: CursorTheme.XiaMu, icon: xiaMuIcon },
  { label: '墨水', value: CursorTheme.Ink, icon: inkIcon },
  { label: '蓝色荧光', value: CursorTheme.BlueFl, icon: blueFlIcon },
  { label: '菱形简约', value: CursorTheme.Retro, icon: retroIcon },
];

export interface Cursor {
  url: string; // 鼠标图片，支持多种格式，建议32*32的png图片（浏览器限制，动图只显示第一帧）
  x?: number; // hotspot-x 视觉中心点距离左上角的x轴像素
  y?: number; // hotspot-y 视觉中心点距离左上角的y轴像素
}
// 额外鼠标主题，一般只需要配置常用的default、pointer、text三种鼠标即可
export interface CursorAppendTheme {
  key: Exclude<string, CursorThemeValue>; // 主题唯一标识, 与内置主题一致时不显示
  label: string; // 主题名称，建议不超过5个字
  default: Cursor; // 默认鼠标配置
  pointer?: Cursor; // 可点击、链接鼠标配置
  text?: Cursor; // 文本鼠标配置
  grab?: Cursor; // 抓取鼠标配置
  help?: Cursor; // 帮助鼠标配置
  move?: Cursor; // 移动时鼠标配置
  noAllowed?: Cursor; // 不允许鼠标配置
  cross?: Cursor; // 精确绘制鼠标配置，一般用不到
}
export interface PulseCursor {
  enabled: boolean;
  theme: CursorThemeValue;
  append?: CursorAppendTheme[]; // 追加鼠标主题
}

export interface PulseParticles {
  enabled: boolean;
}

export interface PulseConfig {
  private?: PulsePrivate;
  cursor?: PulseCursor;
  particles?: PulseParticles;
}

export type PulseTheme = { pulse: PulseConfig };

export const isPulseLoginType = (value: any) => {
  return Object.values(PulseLoginType).includes(value);
}

export interface PostConfig {
  url: string;
  private?: boolean;
}
