import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser'; // Добавьте этот импорт

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'auto',
      plugins: [terser()], // Добавьте минификацию здесь
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'auto',
      plugins: [terser()], // И здесь
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
    }),
  ],
};
