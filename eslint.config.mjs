import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** ESLint flat configs from eslint-config-next (avoid FlatCompat — it breaks with ESLint 9 + Next 16). */
const eslintConfig = [
  ...require("eslint-config-next/core-web-vitals"),
  ...require("eslint-config-next/typescript"),
];

export default eslintConfig;
