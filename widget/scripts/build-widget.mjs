import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';

const outDir = resolve(process.cwd(), 'dist');

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/chat-widget.js',
  bundle: true,
  format: 'iife',
  globalName: 'ChatWidget',
  target: ['es2017'],
  minify: false,
});

const cssSrc = resolve('src/chat-widget.css');
const cssDest = resolve('dist/chat-widget.css');

await mkdir(dirname(cssDest), { recursive: true });
const css = await readFile(cssSrc, 'utf-8');
await writeFile(cssDest, css, 'utf-8');
