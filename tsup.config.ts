import { defineConfig } from 'tsup';

export default defineConfig([
  // Library modules
  {
    entry: {
      'index': 'src/index.ts',
      'primitives/index': 'src/primitives/index.ts',
      'sentinels/index': 'src/sentinels/index.ts',
      'runtime/index': 'src/runtime/index.ts',
      'types/index': 'src/types/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    clean: true,
    external: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
    treeshake: true,
    sourcemap: true,
  },
  // CLI
  {
    entry: {
      'cli/index': 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false,
    banner: { js: '#!/usr/bin/env node' },
    external: ['fs', 'path', 'url', 'child_process'],
    noExternal: [],
    sourcemap: false,
  },
]);
