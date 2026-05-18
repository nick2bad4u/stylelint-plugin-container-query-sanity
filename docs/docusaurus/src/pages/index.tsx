import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import { docsCatalogStats } from "../data/docsCatalog";

import styles from "./index.module.css";

type HeroBadge = Readonly<{
    description: string;
    icon: string;
    label: string;
}>;

type HeroStat = Readonly<{
    description: string;
    headline: string;
    icon: string;
}>;

type HomeCard = Readonly<{
    description: string;
    eyebrow: string;
    icon: string;
    title: string;
    to: string;
}>;

const packageName = "stylelint-plugin-container-query-sanity";
const homepageDescription =
    "Stylelint plugin documentation for validating named containers, container query ranges, containment contracts, and breakpoint token usage.";
const homepageKeywords = `${packageName}, stylelint, css container queries, container query linting, css design tokens`;
const homepageSocialImageUrl = `https://nick2bad4u.github.io/${packageName}/img/logo.png`;
const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: `https://github.com/Nick2bad4u/${packageName}`,
    description: homepageDescription,
    image: homepageSocialImageUrl,
    license: `https://github.com/Nick2bad4u/${packageName}/blob/main/LICENSE`,
    name: packageName,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    url: `https://nick2bad4u.github.io/${packageName}/`,
} as const;

const heroBadges = [
    {
        description:
            "Catches missing, unknown, conflicting, and under-declared named containers.",
        icon: "\uf1b2",
        label: "Named container contracts",
    },
    {
        description:
            "Finds invalid ranges, unreachable nested intervals, and redundant lower bounds.",
        icon: "\uf1de",
        label: "Range sanity checks",
    },
    {
        description:
            "Keeps size, scroll-state, logical-axis, and design-token usage explicit.",
        icon: "\uf0ad",
        label: "Containment-aware diagnostics",
    },
] as const satisfies readonly HeroBadge[];

/**
 * Nerd Font Symbols used by the homepage hero.
 *
 * @see https://www.nerdfonts.com/cheat-sheet
 */
const heroStats = [
    {
        description:
            "• Named containers, query math, containment, and token usage.",
        headline: `${docsCatalogStats.publicRuleCount} rules`,
        icon: "\uf0ca",
    },
    {
        description:
            "• Recommended, strict, and all presets for staged adoption.",
        headline: `${docsCatalogStats.shareableConfigCount} configs`,
        icon: "\ue690",
    },
    {
        description: "• ESM-first plugin pack with compatibility smoke checks.",
        headline: "Stylelint 16+",
        icon: "\uf121",
    },
] as const satisfies readonly HeroStat[];

const homeCards = [
    {
        description:
            "Install the plugin, pick a config, and apply the rules without guessing how Stylelint should load the plugin pack.",
        eyebrow: "Step 1",
        icon: "\uf135",
        title: "• Start clean",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Compare recommended, strict, and all configs so teams can choose the right release posture.",
        eyebrow: "Step 2",
        icon: "\uf0e8",
        title: "• Choose configs",
        to: "/docs/rules/configs",
    },
    {
        description:
            "Browse every rule with concrete CSS examples and options for production rollout.",
        eyebrow: "Step 3",
        icon: "\uf02d",
        title: "• Audit rules",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

const overviewButtonIcon = "\uf05a";
const configsButtonIcon = "\uf0e8";
const sectionKickerIcon = "\uf0c1";

/** Render the Docusaurus landing page for the documentation site. */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            description={homepageDescription}
            title="Container query sanity for Stylelint"
        >
            <Head>
                <meta content={homepageKeywords} name="keywords" />
                <meta content={homepageSocialImageUrl} property="og:image" />
                <meta content="summary_large_image" name="twitter:card" />
                <meta content={homepageSocialImageUrl} name="twitter:image" />
                <script type="application/ld+json">
                    {JSON.stringify(homepageStructuredData)}
                </script>
            </Head>

            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroCopy}>
                            <p className={styles.heroKicker}>
                                <span
                                    aria-hidden="true"
                                    className={styles.nerdIcon}
                                >
                                    &#xf0ad;
                                </span>
                                Stylelint rules for component-scale CSS
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                Container queries need contracts, not vibes.
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                {packageName} validates named containers, query
                                ranges, unreachable intervals, containment
                                types, logical feature usage, and breakpoint
                                token discipline before those issues reach the
                                browser.
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles.heroBadge}
                                        key={badge.label}
                                    >
                                        <div className={styles.heroBadgeHeader}>
                                            <span
                                                aria-hidden="true"
                                                className={styles.heroBadgeIcon}
                                            >
                                                {badge.icon}
                                            </span>
                                            <p
                                                className={
                                                    styles.heroBadgeLabel
                                                }
                                            >
                                                {badge.label}
                                            </p>
                                        </div>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={styles.buttonIcon}
                                    >
                                        {overviewButtonIcon}
                                    </span>
                                    Read the overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/configs"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={styles.buttonIcon}
                                    >
                                        {configsButtonIcon}
                                    </span>
                                    Compare configs
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt={`${packageName} logo`}
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="260"
                                loading="eager"
                                src={logoSrc}
                                width="260"
                            />
                            <div className={styles.heroPanelRange}>
                                <span>container</span>
                                <strong>inline-size</strong>
                                <span>tokens</span>
                            </div>
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                className={styles.heroStatCard}
                                key={stat.headline}
                            >
                                <div className={styles.heroStatHeader}>
                                    <span
                                        aria-hidden="true"
                                        className={styles.heroStatIcon}
                                    >
                                        {stat.icon}
                                    </span>
                                    <p className={styles.heroStatHeading}>
                                        {stat.headline}
                                    </p>
                                </div>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionKicker}>
                            <span
                                aria-hidden="true"
                                className={styles.nerdIcon}
                            >
                                {sectionKickerIcon}
                            </span>
                            Documentation map
                        </p>
                        <Heading as="h2" className={styles.sectionTitle}>
                            Everything links to the release-critical paths.
                        </Heading>
                        <p className={styles.sectionSubtitle}>
                            The site now surfaces rule docs, configs, developer
                            API output, generated inspectors, and project links
                            from the landing page instead of hiding them in a
                            sparse navbar.
                        </p>
                    </div>

                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article className={styles.card} key={card.title}>
                                <div className={styles.cardHeader}>
                                    <span
                                        aria-hidden="true"
                                        className={styles.cardIcon}
                                    >
                                        {card.icon}
                                    </span>
                                    <p className={styles.cardEyebrow}>
                                        {card.eyebrow}
                                    </p>
                                </div>
                                <Heading as="h3" className={styles.cardTitle}>
                                    {card.title}
                                </Heading>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <Link className={styles.cardLink} to={card.to}>
                                    Open section{" "}
                                    <span
                                        aria-hidden="true"
                                        className={styles.inlineLinkIcon}
                                    >
                                        &#xf061;
                                    </span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
