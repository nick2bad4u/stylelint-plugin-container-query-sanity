import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import styles from "@site/src/pages/index.module.css";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import { docsCatalogStats } from "../data/docsCatalog";

const homepageDescription =
    "Stylelint plugin docs for container query sanity rules, configs, and migration status.";

/** Render the primary docs landing page. */
export default function Home() {
    return (
        <Layout
            description={homepageDescription}
            title="Container Query Sanity Stylelint Plugin"
        >
            <Head>
                <meta
                    content="stylelint,container query,css linting,design tokens"
                    name="keywords"
                />
            </Head>
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <p className={styles.heroKicker}>
                        Stylelint plugin for container-query correctness
                    </p>
                    <Heading as="h1" className={styles.heroTitle}>
                        stylelint-plugin-container-query-sanity
                    </Heading>
                    <p className={styles.heroSubtitle}>
                        Validate named containers, query ranges, unreachable
                        intervals, and breakpoint token usage.
                    </p>
                    <div className={styles.heroActions}>
                        <Link
                            className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                            to="/docs/rules/overview"
                        >
                            Overview
                        </Link>
                        <Link
                            className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                            to="/docs/rules/configs"
                        >
                            Configs
                        </Link>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        <article className={styles.heroStatCard}>
                            <p className={styles.heroStatHeading}>
                                {docsCatalogStats.publicRuleCount} Rules
                            </p>
                            <p className={styles.heroStatDescription}>
                                Focused on container-query correctness.
                            </p>
                        </article>
                        <article className={styles.heroStatCard}>
                            <p className={styles.heroStatHeading}>
                                {docsCatalogStats.shareableConfigCount} Configs
                            </p>
                            <p className={styles.heroStatDescription}>
                                Recommended, all, and strict presets.
                            </p>
                        </article>
                    </div>
                </div>
            </header>
        </Layout>
    );
}
