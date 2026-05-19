/**
 * @packageDocumentation
 * Shareable Stylelint config: container-query-strict.
 */
import {
    containerQuerySanityPluginConfigs,
    type ContainerQueryShareableConfig,
} from "../plugin.js";

/** Shareable `container-query-strict` preset for stronger enforcement. */
const containerQueryStrictConfig: ContainerQueryShareableConfig =
    containerQuerySanityPluginConfigs["container-query-strict"];

export default containerQueryStrictConfig;
