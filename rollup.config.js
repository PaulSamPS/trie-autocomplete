import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.min.js',
      format: 'cjs',
      sourcemap: false
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'esm',
      sourcemap: false
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true
    }),
    terser({
      format: {
        comments: false
      },
      compress: {
        drop_console: true
      }
    })
  ],
  external: []
};