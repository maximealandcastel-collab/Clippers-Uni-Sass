import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep all node_modules external — bundling them causes ESM/CJS conflicts
// when deps mix import.meta.url and require() internally.
// We only compile our own TypeScript source files.

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  await rm(distDir, { recursive: true, force: true });

  console.log("building server...");
  const pkgPath = path.resolve(__dirname, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));

  // External = all npm packages EXCEPT workspace packages.
  // Workspace packages (workspace:*) are TypeScript source — esbuild must
  // compile them into the bundle. Leaving them external causes Node.js to
  // try loading raw .ts files at runtime, which crashes.
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter(
    (dep) => !pkg.dependencies?.[dep]?.startsWith("workspace:"),
  );

  await esbuild({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(distDir, "index.cjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    external: externals,
    logLevel: "info",
  });
}

async function buildStaticArtifacts() {
  const projectRoot = path.resolve(__dirname, "../..");
  const opts = { stdio: "inherit" as const, cwd: projectRoot };

  console.log("building p2p-website...");
  execSync("pnpm --filter @workspace/p2p-website run build", opts);

  console.log("building p2p-commercial...");
  execSync("pnpm --filter @workspace/p2p-commercial run build", opts);
}

buildAll()
  .then(() => buildStaticArtifacts())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
