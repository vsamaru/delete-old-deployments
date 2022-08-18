import fs from "fs";
import esbuild, { BuildOptions, Plugin } from "esbuild";

const outDir = "./dist";

const cleanDist: Plugin = {
	name: "clean-dist",
	setup(build) {
		build.onStart(() => {
			fs.rm(outDir, { recursive: true }, () => {});
		});
	},
};

const options: BuildOptions = {
	entryPoints: ["src/index.ts"],
	format: "esm",
	minify: true,
	outdir: outDir,
	platform: "node",
	target: "node14",
	write: true,
	plugins: [cleanDist],
};

await esbuild.build(options);
