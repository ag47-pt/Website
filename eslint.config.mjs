import nextConfig from "eslint-config-next";
import nextConfigCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  { ignores: [".next/**", "**/.next/**", "node_modules/**", "dist/**"] },
  ...nextConfig,
  ...nextConfigCoreWebVitals,
];

export default eslintConfig;
