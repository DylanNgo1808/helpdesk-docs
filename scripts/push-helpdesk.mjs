#!/usr/bin/env node

/**
 * Push markdown documentation to GitBook via Git Import.
 *
 * Flow:
 *   1. Clone GitHub bridge repo
 *   2. Copy markdown files from source directory
 *   3. Commit & push to GitHub
 *   4. Trigger GitBook Git Import to sync content
 *
 * Usage:
 *   node scripts/push-helpdesk.mjs                    # Push ALL files
 *   node scripts/push-helpdesk.mjs discount-list      # Push only one folder
 *   node scripts/push-helpdesk.mjs --dry-run          # Preview without pushing
 *
 * Environment variables:
 *   GITHUB_TOKEN   - GitHub PAT with repo write access
 *   GITBOOK_TOKEN  - GitBook API token
 *
 * Or edit the config section below.
 */

import {execSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync} from 'node:fs';
import {join, resolve} from 'node:path';

// ─── Config (edit these or use env vars) ───
const GITHUB_REPO = process.env.GITHUB_REPO || 'your-org/helpdesk-content';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITBOOK_TOKEN = process.env.GITBOOK_TOKEN || '';
const GITBOOK_SPACE_ID = process.env.GITBOOK_SPACE_ID || '';
const SOURCE_DIR = resolve(import.meta.dirname, '../docs/user-guide');
const TEMP_DIR = '/tmp/helpdesk-docs-push';

// ─── Parse args ───
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const folderFilter = args.find(a => !a.startsWith('--'));

// ─── Validate config ───
function validateConfig() {
  const missing = [];
  if (!GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!GITBOOK_TOKEN) missing.push('GITBOOK_TOKEN');
  if (!GITBOOK_SPACE_ID) missing.push('GITBOOK_SPACE_ID');
  if (GITHUB_REPO === 'your-org/helpdesk-content') missing.push('GITHUB_REPO');
  if (missing.length > 0) {
    console.error(`Missing config: ${missing.join(', ')}`);
    console.error('Set via environment variables or edit the config section in this script.');
    process.exit(1);
  }
}

// ─── Helpers ───
function run(cmd, opts = {}) {
  return execSync(cmd, {encoding: 'utf8', stdio: 'pipe', ...opts}).trim();
}

function copyMarkdownFiles(srcDir, destDir, filter) {
  const copied = [];
  const folders = readdirSync(srcDir).filter(f => {
    const full = join(srcDir, f);
    return statSync(full).isDirectory() && !f.startsWith('.') && f !== 'Icon';
  });

  for (const folder of folders) {
    if (filter && folder !== filter) continue;

    const srcFolder = join(srcDir, folder);
    const destFolder = join(destDir, folder);

    if (!existsSync(destFolder)) mkdirSync(destFolder, {recursive: true});

    const files = readdirSync(srcFolder).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const src = join(srcFolder, file);
      const dest = join(destFolder, file);
      cpSync(src, dest);
      copied.push(`${folder}/${file}`);
    }
  }
  return copied;
}

async function gitbookImport() {
  const url = `https://api.gitbook.com/v1/spaces/${GITBOOK_SPACE_ID}/git/import`;
  const repoUrl = `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITBOOK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: repoUrl, ref: 'refs/heads/main'})
  });

  if (res.status === 204) {
    return {success: true};
  }
  const body = await res.text();
  return {success: false, status: res.status, body};
}

// ─── Main ───
async function main() {
  if (!dryRun) validateConfig();

  console.log('========================================');
  console.log('  Push Markdown -> GitBook');
  console.log('========================================');
  console.log();

  // Step 1: Clone repo
  console.log('1. Cloning GitHub repo...');
  if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, {recursive: true});

  if (dryRun && !GITHUB_TOKEN) {
    console.log('   (dry-run: skipping clone, listing source files)');
    console.log(`2. Files that would be copied${folderFilter ? ` (filter: ${folderFilter})` : ''}:`);

    const folders = readdirSync(SOURCE_DIR).filter(f => {
      const full = join(SOURCE_DIR, f);
      return statSync(full).isDirectory() && !f.startsWith('.') && f !== 'Icon';
    });

    let count = 0;
    for (const folder of folders) {
      if (folderFilter && folder !== folderFilter) continue;
      const files = readdirSync(join(SOURCE_DIR, folder)).filter(f => f.endsWith('.md'));
      for (const file of files) {
        console.log(`   - ${folder}/${file}`);
        count++;
      }
    }
    console.log(`   Total: ${count} file(s)`);
    console.log('\n--dry-run: no changes made.');
    return;
  }

  run(`git clone https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git ${TEMP_DIR}`);
  console.log(`   Done.`);

  // Step 2: Copy markdown files
  console.log(`2. Copying markdown files${folderFilter ? ` (filter: ${folderFilter})` : ''}...`);
  const copied = copyMarkdownFiles(SOURCE_DIR, TEMP_DIR, folderFilter);

  if (copied.length === 0) {
    console.log('   No files to copy. Exiting.');
    rmSync(TEMP_DIR, {recursive: true});
    return;
  }

  for (const f of copied) console.log(`   - ${f}`);
  console.log(`   Total: ${copied.length} file(s)`);

  if (dryRun) {
    console.log('\n--dry-run: no changes made.');
    rmSync(TEMP_DIR, {recursive: true});
    return;
  }

  // Step 3: Commit & push
  console.log('3. Committing & pushing to GitHub...');
  const diff = run('git diff --stat', {cwd: TEMP_DIR});
  const untracked = run('git ls-files --others --exclude-standard', {cwd: TEMP_DIR});

  if (!diff && !untracked) {
    console.log('   No changes detected. Content is up to date.');
  } else {
    run('git add -A', {cwd: TEMP_DIR});
    const msg = folderFilter
      ? `docs: update ${folderFilter} user guide`
      : 'docs: update user guide content';
    run(`git commit -m "${msg}"`, {cwd: TEMP_DIR});
    run('git push origin main', {cwd: TEMP_DIR});
    console.log('   Pushed to GitHub.');
  }

  // Step 4: Trigger GitBook import
  console.log('4. Triggering GitBook Git Import...');
  const result = await gitbookImport();

  if (result.success) {
    console.log('   Import started (HTTP 204).');
    console.log('   Content will update in ~15 seconds.');
  } else {
    console.error(`   Import failed: HTTP ${result.status}`);
    console.error(`   ${result.body}`);
  }

  // Cleanup
  rmSync(TEMP_DIR, {recursive: true});

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
