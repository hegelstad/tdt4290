import { Config } from "bili";
import * as path from "path";

const config: Config = {
  output: {
    moduleName: "Package",
    minify: true,
    format: ["cjs", "esm"],
    dir: "./dist"
  },
  plugins: {
    typescript2: {
      cacheRoot: path.join(__dirname, ".rpt2_cache"),
      useTsconfigDeclarationDir: true
    }
  }
};

export default config;
