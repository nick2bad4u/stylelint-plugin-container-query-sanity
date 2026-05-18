import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    rules: [
        {
            id: "overview",
            label: "Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "Getting Started",
            type: "doc",
        },
        {
            collapsed: false,
            customProps: {
                badge: "configs",
            },
            items: [
                {
                    id: "configs/container-query-recommended",
                    label: "container-query-recommended",
                    type: "doc",
                },
                {
                    id: "configs/container-query-all",
                    label: "container-query-all",
                    type: "doc",
                },
                {
                    id: "configs/container-query-strict",
                    label: "container-query-strict",
                    type: "doc",
                },
            ],
            label: "Configs",
            link: {
                id: "configs/index",
                type: "doc",
            },
            type: "category",
        },
        {
            collapsed: false,
            customProps: {
                badge: "guides",
            },
            items: [
                {
                    id: "guides/current-status",
                    label: "Current Status",
                    type: "doc",
                },
            ],
            label: "Guides",
            type: "category",
        },
        {
            collapsed: false,
            customProps: {
                badge: "rules",
            },
            items: [
                {
                    id: "no-block-axis-query-on-inline-size-container",
                    label: "no-block-axis-query-on-inline-size-container",
                    type: "doc",
                },
                {
                    id: "no-conflicting-container-name-declarations",
                    label: "no-conflicting-container-name-declarations",
                    type: "doc",
                },
                {
                    id: "no-degenerate-container-query-conditions",
                    label: "no-degenerate-container-query-conditions",
                    type: "doc",
                },
                {
                    id: "no-invalid-container-query-ranges",
                    label: "no-invalid-container-query-ranges",
                    type: "doc",
                },
                {
                    id: "no-scroll-state-query-on-non-scroll-state-container",
                    label: "no-scroll-state-query-on-non-scroll-state-container",
                    type: "doc",
                },
                {
                    id: "no-size-query-on-non-size-container",
                    label: "no-size-query-on-non-size-container",
                    type: "doc",
                },
                {
                    id: "no-unknown-container-names",
                    label: "no-unknown-container-names",
                    type: "doc",
                },
                {
                    id: "no-unreachable-container-intervals",
                    label: "no-unreachable-container-intervals",
                    type: "doc",
                },
                {
                    id: "prefer-logical-size-features",
                    label: "prefer-logical-size-features",
                    type: "doc",
                },
                {
                    id: "prefer-range-syntax",
                    label: "prefer-range-syntax",
                    type: "doc",
                },
                {
                    id: "require-breakpoint-token-usage",
                    label: "require-breakpoint-token-usage",
                    type: "doc",
                },
                {
                    id: "require-container-type-for-named-containers",
                    label: "require-container-type-for-named-containers",
                    type: "doc",
                },
                {
                    id: "require-named-container",
                    label: "require-named-container",
                    type: "doc",
                },
            ],
            label: "Rules",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
