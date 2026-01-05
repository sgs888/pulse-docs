import { getStyleFromHsl } from '@tsparticles/engine';
import type { IShapeDrawer, Particle, IDelta, IHsl } from '@tsparticles/engine';

const hslToColorStyle = (hsl: IHsl, defaultColor: string = '#000') => {
  if (!hsl) {
    return defaultColor;
  }
  return getStyleFromHsl(hsl);
}

export const triangleShape: IShapeDrawer = {
  validTypes: ['test-triangle'],
  draw({ context, particle, radius, opacity, delta }) {
    const { x, y } = particle.position;

    const fillColor = hslToColorStyle(particle.getFillColor());
    const strokeColor = hslToColorStyle(particle.getStrokeColor());
    const strokeWidth = particle.strokeWidth || 1;
    const rotation = particle.rotation;

    context.save();
    context.globalAlpha = opacity; // 使用传入的 opacity
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;

    // console.log("rotation =", rotation);
    if (rotation !== undefined) {
      context.translate(x, y);
      context.rotate(rotation);
      context.translate(-x, -y);
    }

    context.beginPath();
    context.moveTo(x, y - radius);           // 顶点
    context.lineTo(x - radius, y + radius);  // 左下
    context.lineTo(x + radius, y + radius);  // 右下
    context.closePath();

    context.fill();
    context.stroke();
    context.restore();
  },
  getSidesCount() {
    return 3;
  }
}