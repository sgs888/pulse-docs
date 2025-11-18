import { toRaw } from 'vue';
import { useData } from 'vitepress';
import { type PulseTheme } from '../config/pulseConfig';

export const usePulseConfig = () => {
  const { theme } = useData<PulseTheme>();

  const getPulseConfig = (key: string) => {
    return toRaw(theme.value.pulse[key]);
  }

  return {
    getPulseConfig
  }
}