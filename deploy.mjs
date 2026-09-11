// One-command deploy: rebuild dist/ then publish it to the gh-pages branch.
//
// Layout: `main` carries the source, `gh-pages` carries the built site that
// GitHub Pages serves. dist/ is a git worktree attached to gh-pages, so a build
// writes straight into the branch that gets published. dist/ is gitignored on
// main and is never tracked there.
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const BRANCH = 'gh-pages';

function run(cmd, cwd = ROOT) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}
function capture(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// 1. Attach dist/ to gh-pages as a worktree if it is not already.
if (!existsSync(path.join(DIST, '.git'))) {
  if (existsSync(DIST)) {
    console.error('\n✗ dist/ exists but is not a git worktree.');
    console.error('  Delete or rename dist/, then run this again.');
    process.exit(1);
  }
  const local = capture(`git rev-parse --verify ${BRANCH}`);
  const remote = capture(`git rev-parse --verify origin/${BRANCH}`);
  if (local) {
    run(`git worktree add dist ${BRANCH}`);
  } else if (remote) {
    run(`git worktree add dist -b ${BRANCH} origin/${BRANCH}`);
  } else {
    console.error(`\n✗ No ${BRANCH} branch found locally or on origin.`);
    process.exit(1);
  }
}

// 2. Fresh build into the worktree. cleanDist() keeps .git, so the branch
//    checkout survives and every removed page shows up as a deletion.
run('node build.mjs');

// 3. Commit and publish.
const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
run('git add -A', DIST);
if (capture('git status --porcelain', DIST)) {
  run(`git commit -m "deploy: ${stamp}"`, DIST);
} else {
  console.log('(nothing new to publish)');
}
run(`git push origin ${BRANCH}`, DIST);
console.log('\n✓ Deployed. Live in ~1 min at https://agatha-felix.com');
