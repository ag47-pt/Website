import nextConfig from "eslint-config-next";
import nextConfigCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextConfig,
  ...nextConfigCoreWebVitals,
];

export default eslintConfig;
