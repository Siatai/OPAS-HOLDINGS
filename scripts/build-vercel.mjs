import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist", "vercel");

const projects = [
  {
    name: "sexolicious",
    dir: path.join(rootDir, "artifacts", "sexolicious"),
    basePath: "/",
    mount: "",
  },
  {
    name: "opas-investor-deck",
    dir: path.join(rootDir, "artifacts", "opas-investor-deck"),
    basePath: "/opas-investor-deck/",
    mount: "opas-investor-deck",
  },
  {
    name: "opas-customer-deck",
    dir: path.join(rootDir, "artifacts", "opas-customer-deck"),
    basePath: "/opas-customer-deck/",
    mount: "opas-customer-deck",
  },
  {
    name: "opas-overview-deck",
    dir: path.join(rootDir, "artifacts", "opas-overview-deck"),
    basePath: "/opas-overview-deck/",
    mount: "opas-overview-deck",
  },
];

function runPnpmBuild(projectDir, basePath) {
  const command = `corepack pnpm --dir "${projectDir}" run build`;
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      BASE_PATH: basePath,
    },
  });

  if (result.status !== 0) {
    throw new Error(`Build failed for ${projectDir}`);
  }
}

async function copyProjectOutput(projectDir, mount) {
  const sourceDir = path.join(projectDir, "dist", "public");
  const targetDir = mount ? path.join(distDir, mount) : distDir;

  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  for (const project of projects) {
    console.log(`\n[build-vercel] building ${project.name} with BASE_PATH=${project.basePath}`);
    runPnpmBuild(project.dir, project.basePath);
    console.log(`[build-vercel] copying ${project.name} output to ${project.mount || "/"}`);
    await copyProjectOutput(project.dir, project.mount);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
