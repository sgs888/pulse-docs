/**
 * 设置 CSS 自定义变量（通过动态 <style> 标签）
 * @param id <style> 元素的 ID
 * @param vars 要设置的 CSS 变量对象，例如 { '--primary': '#00f' }
 * @param mode 'replace'（默认）或 'merge'
 */
function setCSSVariables(
  id: string,
  vars: Record<string, string>,
  mode: 'replace' | 'merge' = 'replace'
): void {
  // 获取或创建 <style> 元素
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    document.head.appendChild(style);
  }

  let currentVars: Record<string, string> = {};

  if (mode === 'merge' && style.textContent) {
    // 从现有 content 中解析已有的 CSS 变量（简易解析）
    const matches = style.textContent.match(/(--[a-zA-Z0-9-_]+)\s*:\s*([^;}]*)/g);
    if (matches) {
      for (const match of matches) {
        const [key, value] = match.split(':').map(s => s.trim());
        if (key && value !== undefined) {
          currentVars[key] = value;
        }
      }
    }
  }

  // 合并或替换
  const finalVars = mode === 'merge' ? { ...currentVars, ...vars } : vars;

  // 生成 CSS 内容
  const cssText = `:root {\n${Object.entries(finalVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;

  style.textContent = cssText;
}

/**
 * 清空或移除指定 ID 的动态 CSS 变量 <style> 元素
 * @param id 要操作的 <style> 元素的 ID
 * @param action 'clear' | 'remove' —
 *   - 'clear': 仅清空内容（保留 <style> 标签）
 *   - 'remove': 完全从 DOM 中删除该 <style> 元素（默认）
 */
function removeCSSVariableStyle(
  id: string,
  action: 'clear' | 'remove' = 'remove'
): void {
  const style = document.getElementById(id) as HTMLStyleElement | null;

  if (!style || style.tagName !== 'STYLE') {
    return;
  }

  if (action === 'clear') {
    style.textContent = ''; // 仅清空内容，保留元素
  } else {
    style.remove(); // 完全移除元素
  }
}

export const useCssVars = () => {
  return {
    setCSSVariables,
    removeCSSVariableStyle
  };
}