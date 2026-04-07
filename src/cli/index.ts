import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync, cpSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Templates are at package root /templates
const TEMPLATES_DIR = resolve(__dirname, '../../templates');

function log(msg: string) {
  console.log(`  ${msg}`);
}

function logHeader(msg: string) {
  console.log(`\n  ■ ${msg}\n`);
}

function logDone(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function logError(msg: string) {
  console.error(`\n  ✗ ${msg}\n`);
}

function copyTemplateDir(srcDir: string, destDir: string) {
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const entries = readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath);
    } else {
      writeFileSync(destPath, readFileSync(srcPath, 'utf-8'));
    }
  }
}

function countFiles(dir: string): number {
  let count = 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

function init(targetDir: string = process.cwd()) {
  const kevlarDir = join(targetDir, 'kevlar');

  if (existsSync(kevlarDir)) {
    logError('kevlar/ directory already exists. Remove it first or use a fresh project.');
    process.exit(1);
  }

  logHeader('Kevlar — initializing');

  // Check templates exist
  if (!existsSync(TEMPLATES_DIR)) {
    logError(`Templates not found at ${TEMPLATES_DIR}. Reinstall @unlikefraction/kevlar.`);
    process.exit(1);
  }

  // Copy all templates
  log('Copying design config...');
  copyTemplateDir(TEMPLATES_DIR, kevlarDir);

  const fileCount = countFiles(kevlarDir);
  logDone(`Created kevlar/ with ${fileCount} files`);

  log('');
  log('Files created:');
  log('  kevlar/design.config.ts          — your design language');
  log('  kevlar/base/*.tsx                 — 9 base components');
  log('  kevlar/components/*.tsx           — 108 component files');
  log('  kevlar/index.ts                  — re-exports everything');
  log('');
  log('Next steps:');
  log('  1. Fill in kevlar/design.config.ts with your design tokens');
  log('  2. Fill in kevlar/base/*.tsx — replace every MUST_BE_DEFINED');
  log('  3. Start using components: import { Button } from \'./kevlar\'');
  log('');
  log('Every MUST_BE_DEFINED is a question. Answer them all.');
  log('');
}

function create(projectName: string) {
  if (!projectName) {
    logError('Usage: kevlar create <project-name>');
    process.exit(1);
  }

  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    logError(`Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  logHeader(`Kevlar — creating ${projectName}`);

  // Create Next.js project
  log('Creating Next.js project...');
  try {
    execSync(`npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch {
    logError('Failed to create Next.js project. Make sure npx is available.');
    process.exit(1);
  }

  // Install Mantine
  log('Installing Mantine v9...');
  try {
    execSync('npm install @mantine/core @mantine/hooks @unlikefraction/kevlar', {
      stdio: 'inherit',
      cwd: targetDir,
    });
  } catch {
    logError('Failed to install Mantine. Run npm install manually.');
  }

  // Init kevlar in the new project's src/
  const srcDir = join(targetDir, 'src');
  init(srcDir);

  logDone(`Project "${projectName}" created with Kevlar`);
  log('');
  log(`  cd ${projectName}`);
  log('  npm run dev');
  log('');
}

// ─── Main ─────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    init();
    break;
  case 'create':
    create(args[1]);
    break;
  case '--help':
  case '-h':
  case undefined:
    console.log(`
  Kevlar — Component scaffold for Mantine v9

  Usage:
    kevlar init              Scaffold kevlar/ into current project
    kevlar create <name>     Create new Next.js project with Kevlar
    kevlar --help            Show this help

  Every component. Every state. Every target. Every decision. Filled or it throws.
`);
    break;
  default:
    logError(`Unknown command: ${command}. Run "kevlar --help" for usage.`);
    process.exit(1);
}
