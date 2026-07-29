import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'js/main.js',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'CognitiveTraining',
        sourcemap: true,
        plugins: [terser()]
      },
      {
        file: 'dist/bundle.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
