/**
 * @packageDocumentation
 * Shareable Stylelint config: container-query-all.
 */
import {
    containerQuerySanityPluginConfigs,
    type ContainerQueryShareableConfig,
} from "../plugin.js";

/** Shareable `container-query-all` preset for exhaustive enforcement. */
const containerQueryAllConfig: ContainerQueryShareableConfig =
    containerQuerySanityPluginConfigs["container-query-all"];

export default containerQueryAllConfig;
