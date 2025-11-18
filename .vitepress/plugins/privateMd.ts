import path from 'node:path';
import fs from 'node:fs';
import { type Plugin, normalizePath } from 'vite';
import { createMarkdownRenderer } from 'vitepress';
import matter from 'gray-matter';

const generatePrivateContent = (data: Record<string, any>) => {
  return `---
title: ${data.title}
private: true
---

<div class="private-placeholder">🔒 内容受限</div>
`
}

/**
 * 创建私密 Markdown 虚拟化插件
 * @param srcDir - 原始 docs 目录（绝对路径）
 */
export function createPrivateMdPlugin(srcDir: string) {
  const SRC_DOCS_DIR = srcDir;
  const SRC_DIR_POSIX = normalizePath(SRC_DOCS_DIR);
  const PRIVATE_ORIGINAL_CONTENT = new Map();
  const IS_PRIVATE_CACHE = new Map();
  let markdownToVue;

  function isPrivateFile(filePath: string) {
    if (IS_PRIVATE_CACHE.has(filePath)) {
      return IS_PRIVATE_CACHE.get(filePath);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      const isPrivate = data.private === true;
      IS_PRIVATE_CACHE.set(filePath, isPrivate);

      if (isPrivate) {
        const relPath = path.relative(SRC_DOCS_DIR, filePath);
        PRIVATE_ORIGINAL_CONTENT.set(relPath, content);
      }
      return isPrivate;
    } catch (err) {
      console.warn(`[PrivateMD] Failed to parse ${filePath}`, err);
      IS_PRIVATE_CACHE.set(filePath, false);
      return false;
    }
  }

  const plugin: Plugin = {
    name: 'vitepress-private-md-plugin',
    enforce: 'pre',
    configResolved(config) {
      const vpPlugin = config.plugins.find(p => p.name === 'vitepress');
      console.log('iiii', config.plugins);
      if (vpPlugin?.api?.markdownToVue) {
        markdownToVue = vpPlugin.api.markdownToVue;
      } else {
        console.error('❌ Failed to inject markdownToVue. Make sure this plugin runs AFTER vitepress.');
      }
    },
    resolveId(id) {
      if (!id.endsWith('.md')) return null;

      let absolutePath: string;

      if (id.startsWith('/@fs/')) {
        try {
          absolutePath = decodeURIComponent(id.slice('/@fs/'.length));
        } catch {
          return null;
        }
      } else if (id.startsWith('/docs/')) {
        absolutePath = path.resolve(SRC_DOCS_DIR, id.slice('/docs/'.length));
      } else if (path.isAbsolute(id)) {
        absolutePath = id;
      } else {
        return null;
      }

      const normalized = normalizePath(absolutePath);

      if (normalized.startsWith(SRC_DIR_POSIX)) {
        if (isPrivateFile(normalized)) {
          return `\0private-md:${normalized}`;
        }
      }

      return null;
    },

    async load(id: string) {
      if (id.startsWith('\0private-md:')) {
        const realPath = id.slice('\0private-md:'.length);
        const relPath = path.relative(SRC_DOCS_DIR, realPath);
        const original = PRIVATE_ORIGINAL_CONTENT.get(relPath);
        const { data } = matter(original);

        const safeMd = `---
${Object.entries(data)
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join('\n')}
---

<div class="vp-doc private-content">
  <h1>🔒 私密内容</h1>
  <p>此内容仅限授权访问。</p>
</div>
`;
        if (typeof markdownToVue === 'function') {
          const result = await markdownToVue(safeMd, realPath);
          return result.code;
        }

        throw new Error('[PrivateMD] Failed to get markdownToVue from VitePress');
      }
      return null;
    }
  };

  return {
    privateMdPlugin: plugin,
    privateContentMap: PRIVATE_ORIGINAL_CONTENT
  };
}