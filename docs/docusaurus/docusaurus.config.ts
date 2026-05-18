import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "Nick2bad4u";
const projectName = "stylelint-plugin-container-query-sanity";
const siteOrigin = "https://nick2bad4u.github.io";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ??
    "/stylelint-plugin-container-query-sanity/";

const config = {
    baseUrl,
    baseUrlIssueBanner: true,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        format: "detect",
    },
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                sidebarPath: "./sidebars.rules.ts",
            },
        ],
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "queryString",
                    "standalone",
                ],
                pwaHead: [
                    {
                        href: "/manifest.json",
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: "#0f172a",
                        name: "theme-color",
                        tagName: "meta",
                    },
                ],
            },
        ],
        "docusaurus-plugin-image-zoom",
    ],
    presets: [
        [
            "classic",
            {
                blog: {
                    showReadingTime: true,
                },
                docs: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    path: "site-docs",
                    routeBasePath: "docs",
                    sidebarPath: "./sidebars.ts",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline:
        "Stylelint rules for named containers, range sanity, and breakpoint token discipline.",
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            respectPrefersColorScheme: true,
        },
        image: "img/logo.png",
        footer: {
            links: [
                {
                    items: [
                        {
                            label: "Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "Configs",
                            to: "/docs/rules/configs",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "NPM",
                        },
                        {
                            href: "https://stylelint.io/developer-guide/plugins/",
                            label: "Stylelint Plugin Guide",
                        },
                    ],
                    title: "Project",
                },
            ],
            style: "dark",
        },
        navbar: {
            items: [
                {
                    label: "Docs",
                    position: "left",
                    to: "/docs/rules/overview",
                },
                {
                    label: "Configs",
                    position: "left",
                    to: "/docs/rules/configs",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
            ],
            logo: {
                alt: "stylelint-plugin-container-query-sanity logo",
                src: "img/favicon.ico",
            },
            title: "stylelint-plugin-container-query-sanity",
        },
        prism: {
            darkTheme: prismThemes.dracula,
            theme: prismThemes.github,
        },
    } satisfies Preset.ThemeConfig,
    title: "stylelint-plugin-container-query-sanity",
    trailingSlash: false,
    url: siteOrigin,
} satisfies Config;

export default config;
