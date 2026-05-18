import sharedConfig from "stylelint-config-nick2bad4u";

const unsupportedExtends = new Set([
    "stylelint-plugin-docusaurus/configs/docusaurus-all",
]);
const normalizedExtends = Array.isArray(sharedConfig.extends)
    ? sharedConfig.extends.filter(
          (entry) => typeof entry === "string" && !unsupportedExtends.has(entry)
      )
    : [];
const sharedRules =
    typeof sharedConfig.rules === "object" && sharedConfig.rules !== null
        ? sharedConfig.rules
        : {};
const normalizedRules = Object.fromEntries(
    Object.entries(sharedRules).filter(
        ([ruleName]) => !ruleName.startsWith("docusaurus/")
    )
);
const normalizedOverrides = Array.isArray(sharedConfig.overrides)
    ? sharedConfig.overrides.map((override) => {
          if (
              typeof override !== "object" ||
              override === null ||
              typeof override.rules !== "object" ||
              override.rules === null
          ) {
              return override;
          }

          const overrideRules = Object.fromEntries(
              Object.entries(override.rules).filter(
                  ([ruleName]) => !ruleName.startsWith("docusaurus/")
              )
          );

          return {
              ...override,
              rules: overrideRules,
          };
      })
    : sharedConfig.overrides;

/** @type {import("stylelint").Config} */
const stylelintConfig = {
    ...sharedConfig,
    extends: normalizedExtends,
    rules: normalizedRules,
    ...(normalizedOverrides === undefined
        ? {}
        : { overrides: normalizedOverrides }),
};

export default stylelintConfig;
