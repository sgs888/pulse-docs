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

export interface PulseConfig {
  private?: PulsePrivate;
}

export type PulseTheme = { pulse: PulseConfig };

export const isPulseLoginType = (value: any) => {
  return Object.values(PulseLoginType).includes(value);
}
