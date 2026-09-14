import { promises as fs } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import React from 'react';
import { renderToString } from 'react-dom/server';
import esbuild from 'esbuild';
import sharp from 'sharp';

// Compile the actual component sources, so edits under project/components
// cannot be silently overridden by an old design-tool bundle.
export async function buildComponents(source) {
  const exports = {
    'content/FAQItem': ['FAQItem'], 'content/ProductCard': ['ProductCard'],
    'content/SectionHeader': ['SectionHeader'], 'content/Stat': ['Stat'],
    'content/Step': ['Step'], 'content/TestimonialCard': ['TestimonialCard'],
    'core/Badge': ['Badge'], 'core/Button': ['Button'],
    'core/Card': ['Card'], 'core/Chip': ['Chip'],
    'forms/Input': ['Input', 'Select', 'Textarea'],
  };
  const contents = Object.entries(exports).map(([file, names]) =>
    `export { ${names.join(', ')} } from './components/${file}.jsx';`).join('\n');
  const result = await esbuild.build({
    stdin: { contents, resolveDir: source, loader: 'js' },
    bundle: true, write: false, format: 'iife',
    globalName: 'window.AgathaFelixDesignSystem_3557c1',
    minify: true, target: 'es2018', legalComments: 'none',
    plugins: [{ name: 'shared-react', setup(build) {
      build.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'shared-react' }));
      build.onLoad({ filter: /.*/, namespace: 'shared-react' }, () => ({ contents: 'module.exports = window.React;' }));
    } }],
  });
  return result.outputFiles[0].text;
}

// Keep original URLs available, but serve bounded-size WebP copies in the UI.
export async function optimizePhotos(dist) {
  const files = [];
  for (const folder of ['products', 'portfolio', 'factory']) {
    const dir = path.join(dist, 'assets', folder);
    for (const name of await fs.readdir(dir)) {
      if (/\.png$/i.test(name)) files.push(path.join(dir, name));
    }
  }
  for (const name of ['document-keeper-green.png', 'hero-products.png']) {
    files.push(path.join(dist, 'assets', name));
  }
  const names = new Set();
  let before = 0, after = 0;
  for (const file of files) {
    const original = await fs.stat(file);
    const output = file.replace(/\.png$/i, '.webp');
    const info = await sharp(file).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 }).toFile(output);
    names.add(path.basename(file));
    before += original.size;
    after += info.size;
  }
  console.log(`  photos: ${files.length} WebP copies, ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`);
  return (code) => code.replace(/[\w-]+\.png\b/g, (name) => names.has(name) ? name.replace(/\.png$/, '.webp') : name);
}

// The kit uses window exports and injects a few style elements during render.
// A fresh context per page captures those styles in the initial HTML. Effects
// and browser event handlers never run here.
export function prerender({ bundle, sections, glue, media }) {
  const styles = [];
  const root = {};
  const document = {
    getElementById: (id) => id === 'root' ? root : styles.find((style) => style.id === id) || null,
    createElement: (tag) => {
      if (tag !== 'style') throw new Error(`Unexpected DOM operation during prerender: ${tag}`);
      return { dataset: {}, textContent: '' };
    },
    head: { appendChild: (style) => styles.push(style) },
  };
  let html;
  const window = { React, AF_MEDIA: media };
  const context = vm.createContext({ React, window, document, console,
    ReactDOM: { hydrateRoot: (_, element) => { html = renderToString(element); } },
  });
  for (const code of [bundle, ...sections, glue]) vm.runInContext(code, context, { timeout: 10000 });
  if (!html?.includes('<h1')) throw new Error('Prerender produced no primary content');
  const css = styles.map((style) => `<style${style.id ? ` id="${style.id}"` : ''}>${style.textContent}</style>`).join('\n');
  return { html, css };
}
