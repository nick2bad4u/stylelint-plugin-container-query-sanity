/**
 * @packageDocumentation
 * Shareable Stylelint config: container-query-recommended.
 */
import {
    containerQuerySanityPluginConfigs,
    type ContainerQueryShareableConfig,
} from "../plugin.js";

/** Shareable `container-query-recommended` preset for default adoption. */
const containerQueryRecommendedConfig: ContainerQueryShareableConfig =
    containerQuerySanityPluginConfigs["container-query-recommended"];

export default containerQueryRecommendedConfig;
