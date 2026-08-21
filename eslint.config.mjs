import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

/*
 * Storybook (future design-system work):
 *   npm install -D eslint-plugin-storybook
 *   import storybook from "eslint-plugin-storybook";
 *   ...storybook.configs["flat/recommended"],
 *   Extend files/tests overrides for *.stories.{ts,tsx} if stricter rules are needed.
 */

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
      import: importPlugin,
      boundaries,
    },
    settings: {
      /*
       * Architectural layers use boundaries/files (not elements) because v7 element
       * descriptors target folder units. Flat files such as src/lib/data/portfolio.ts
       * classify deterministically with files-single-match + most-specific-first order.
       */
      "boundaries/files-single-match": true,
      "boundaries/files": [
        { category: "lib-data", pattern: "src/lib/data/**/*" },
        { category: "lib-actions", pattern: "src/lib/actions/**/*" },
        { category: "lib-db", pattern: "src/lib/db/**/*" },
        { category: "lib", pattern: "src/lib/**/*" },
        { category: "app", pattern: "src/app/**/*" },
        { category: "components", pattern: "src/components/**/*" },
        { category: "hooks", pattern: "src/hooks/**/*" },
        { category: "tests", pattern: "tests/**/*" },
        { category: "tests", pattern: "src/__tests__/**/*" },
        { category: "scripts", pattern: "scripts/**/*" },
      ],
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    rules: {
      /*
       * Accessibility — CRM baseline. Next core-web-vitals already warns on alt-text + aria-props.
       * Extra jsx-a11y rules (anchor-is-valid, label-has-associated-control, etc.) cannot run
       * at error severity until eslint-plugin-jsx-a11y supports minimatch@10 (repo override).
       */
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",

      // TypeScript correctness / consistency
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // General correctness
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-else-return": "error",
      "object-shorthand": "error",
      "prefer-const": "error",

      // Import hygiene
      "unused-imports/no-unused-imports": "error",
      "import/no-cycle": "error",
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
            ["type"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // Maintainability — portfolio global thresholds (admin/editor hotspots overridden below)
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-nested-ternary": "error",
      "max-depth": ["error", 4],
      "max-params": ["error", 5],
      complexity: ["error", 15],
      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": [
        "error",
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],

      // Architecture — default allow; block known dangerous directions only
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { file: { categories: ["components"] } },
              disallow: {
                to: {
                  file: { categories: { anyOf: ["lib-data", "lib-db"] } },
                },
              },
              message:
                "Components must not import the data or DB layers. Use server actions, route loaders, or presentation helpers.",
            },
            {
              from: { file: { categories: ["hooks"] } },
              disallow: {
                to: {
                  file: { categories: { anyOf: ["lib-data", "lib-db"] } },
                },
              },
              message: "Hooks must not import the data or DB layers.",
            },
            {
              from: { file: { categories: ["lib-data"] } },
              disallow: {
                to: {
                  file: {
                    categories: {
                      anyOf: ["components", "app", "hooks", "lib-actions"],
                    },
                  },
                },
              },
              message:
                "Data layer must not import UI, routes, hooks, or server actions.",
            },
            {
              from: { file: { categories: ["lib-db"] } },
              disallow: {
                to: {
                  file: {
                    categories: {
                      anyOf: [
                        "components",
                        "app",
                        "hooks",
                        "lib-actions",
                        "lib-data",
                      ],
                    },
                  },
                },
              },
              message:
                "DB client must not import application, UI, action, or data layers.",
            },
            {
              from: { file: { categories: ["lib"] } },
              disallow: {
                to: {
                  file: {
                    categories: { anyOf: ["components", "app", "hooks"] },
                  },
                },
              },
              message: "lib/ must not import UI or route code.",
            },
          ],
        },
      ],
    },
  },
  {
    // Server-first pages — verified against src/app/__eslint-fixture-test__/page.tsx (fixture removed after pass)
    files: ["src/app/**/page.tsx"],
    ignores: ["src/app/login/page.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'Program > ExpressionStatement > Literal[value="use client"]',
          message:
            "page.tsx must remain a Server Component. Move interactivity into smaller client components.",
        },
      ],
    },
  },
  {
    /*
     * Login is intentionally a client page: useSearchParams + form interactivity
     * require client hooks. Exception is scoped to src/app/login/** only.
     */
    files: ["src/app/login/**/*.{ts,tsx}"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 120,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 120,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      complexity: ["error", 20],
      // Defense in depth: immediate alias feedback alongside boundaries/files policies
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/data/*", "@/lib/db/*"],
              message:
                "Components must not import the data layer. Use server actions or route loaders.",
            },
          ],
        },
      ],
    },
  },
  {
    /*
     * Admin editors orchestrate many fields/tabs; higher limits are scoped here
     * rather than weakening global component rules.
     */
    files: ["src/components/Admin/**/*.{ts,tsx}"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      complexity: ["error", 35],
    },
  },
  {
    /*
     * Existing editor payload orchestration is branch-heavy (field mapping).
     * Keep this exception narrowly scoped; prefer decomposition over raising it.
     */
    files: ["src/lib/portfolio/project-editor.ts"],
    rules: {
      complexity: ["error", 70],
    },
  },
  {
    files: [
      "src/lib/data/**/*.{ts,tsx}",
      "src/lib/portfolio/public-project.ts",
    ],
    rules: {
      complexity: ["error", 35],
    },
  },
  {
    files: ["src/lib/db/**/*.{ts,tsx}"],
    rules: {
      complexity: ["error", 18],
    },
  },
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/data/*", "@/lib/db/*"],
              message: "Hooks must not import the data layer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/lib/types/**/*.{ts,tsx}"],
    rules: {
      "max-lines": [
        "error",
        { max: 350, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["src/lib/data/**/*.{ts,tsx}"],
    rules: {
      "max-lines": [
        "error",
        { max: 350, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["scripts/**/*.{ts,mjs,cjs}"],
    rules: {
      "no-console": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
    },
  },
  {
    files: [
      "tests/**/*.{ts,tsx}",
      "src/__tests__/**/*.{ts,tsx}",
      "**/*.{test,spec}.{ts,tsx}",
    ],
    rules: {
      "no-console": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "no-nested-ternary": "off",
      complexity: "off",
      "max-params": "off",
      "boundaries/dependencies": "off",
    },
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "max-lines": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "storybook-static/**",
    ".lighthouseci/**",
  ]),
]);
