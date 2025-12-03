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
}
export type CursorThemeValue = `${CursorTheme}`;
export interface CursorConfig {
  label: string;
  value: CursorTheme;
  icon?: string;
}

import defaultIcon from '../cursors/other/default.svg';
import customIcon from '../cursors/other/custom.svg';
import macIcon from '../cursors/mac/default.png';
import paperIcon from '../cursors/paperFold/default.png';
import kroniiIcon from '../cursors/kronii/default.png';
import blackWukongIcon from '../cursors/blackWukong/default.png';
import paperPlaneIcon from '../cursors/paperPlane/default.png';
export const cursorList: CursorConfig[] = [
  { label: '默认', value: CursorTheme.Default, icon: defaultIcon },
  { label: 'MacOS', value: CursorTheme.Mac, icon: macIcon },
  { label: '折纸', value: CursorTheme.PaperFold, icon: paperIcon },
  { label: '纸飞机', value: CursorTheme.PaperPlane, icon: paperPlaneIcon },
  { label: '奥罗·克洛尼', value: CursorTheme.Kronii, icon: kroniiIcon },
  { label: '黑神话·悟空', value: CursorTheme.BlackWukong, icon: blackWukongIcon },
  { label: '自定义', value: CursorTheme.Custom, icon: customIcon },
];

export interface Cursor {
  url: string;
  x?: number; // hotspot-x
  y?: number; // hotspot-y
}
export interface PulseCursor {
  enabled: boolean;
  theme: CursorThemeValue;
  custom?: { // 鼠标自定义
    default?: Cursor;
    pointer?: Cursor;
    text?: Cursor;
    grab?: Cursor;
    grabbing?: Cursor;
    help?: Cursor;
    move?: Cursor;
    noAllowed?: Cursor;
    cross?: Cursor;
  };
}

export interface PulseConfig {
  private?: PulsePrivate;
  cursor?: PulseCursor;
}

export type PulseTheme = { pulse: PulseConfig };

export const isPulseLoginType = (value: any) => {
  return Object.values(PulseLoginType).includes(value);
}

export interface PostConfig {
  url: string;
  private?: boolean;
}
