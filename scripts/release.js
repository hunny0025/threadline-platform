#!/usr/bin/env node
// ============================================================
// Threadline Platform — Release Tagging Script
// Usage: node scripts/release.js [patch|minor|major|v1.0-beta]
// Bumps version in package.json, creates a git tag, and pushes.
// ============================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_PKG = path.join(__dirname, '..', 'package.json');
const CLIENT_PKG = path.join(__dirname, '..', 'client', 'package.json');

function exec(cmd) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.replace(/^v/, '').split('.').map(Number);
  switch (bumpType) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    default: return bumpType; // Allow explicit version like "v1.0-beta"
  }
}

function updatePackageVersion(pkgPath, newVersion) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion.replace(/^v/, '');
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
  console.log(`  📦 Updated ${path.basename(path.dirname(pkgPath))}/package.json → ${newVersion}`);
}

async function main() {
  const bumpType = process.argv[2] || 'patch';

  console.log('\n🏷️  Threadline Release Script\n');
  console.log('━'.repeat(50));

  // 1. Check for clean working tree
  console.log('\n📋 Pre-release checks:');
  try {
    const status = exec('git status --porcelain');
    if (status) {
      console.log('  ⚠️  Working tree has uncommitted changes:');
      console.log(status.split('\n').map(l => `     ${l}`).join('\n'));
      console.log('  Committing all changes before tagging...');
      exec('git add -A');
      exec('git commit -m "chore: pre-release cleanup"');
    } else {
      console.log('  ✅ Working tree is clean');
    }
  } catch (e) {
    console.log('  ⚠️  Git status check failed — continuing anyway');
  }

  // 2. Read current version
  const rootPkg = JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8'));
  const currentVersion = rootPkg.version;
  const newVersion = bumpType.includes('.') || bumpType.includes('-')
    ? bumpType
    : bumpVersion(currentVersion, bumpType);
  const tag = newVersion.startsWith('v') ? newVersion : `v${newVersion}`;

  console.log(`\n🔖 Version: ${currentVersion} → ${newVersion} (tag: ${tag})`);

  // 3. Bump versions
  console.log('\n📦 Updating package versions:');
  updatePackageVersion(ROOT_PKG, newVersion);
  if (fs.existsSync(CLIENT_PKG)) {
    updatePackageVersion(CLIENT_PKG, newVersion);
  }

  // 4. Commit version bump
  console.log('\n📝 Committing version bump:');
  exec('git add -A');
  exec(`git commit -m "release: ${tag}"`);

  // 5. Create annotated tag
  console.log('\n🏷️  Creating tag:');
  exec(`git tag -a ${tag} -m "Release ${tag}"`);
  console.log(`  ✅ Tag ${tag} created`);

  // 6. Push
  console.log('\n🚀 Pushing to remote:');
  try {
    exec('git push origin main');
    exec(`git push origin ${tag}`);
    console.log('  ✅ Pushed commits and tag to origin');
  } catch (e) {
    console.log('  ⚠️  Push failed — you may need to push manually:');
    console.log(`     git push origin main && git push origin ${tag}`);
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`\n✅ Release ${tag} complete!\n`);
  console.log('Next steps:');
  console.log(`  1. Create GitHub release: https://github.com/hunny0025/threadline-platform/releases/new?tag=${tag}`);
  console.log('  2. Deploy backend to Railway');
  console.log('  3. Deploy frontend to Vercel');
  console.log('  4. Run smoke tests: bash scripts/smoke-test.sh');
  console.log('  5. Monitor Sentry for 2 hours post-deploy\n');
}

main().catch((err) => {
  console.error('\n❌ Release failed:', err.message);
  process.exit(1);
});
