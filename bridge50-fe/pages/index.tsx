import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const MetaMaskCard = dynamic(
  () => import("../components/connectors/MetaMaskCard"),
  { ssr: false }
);

const Bridge = dynamic(() => import("../components/Bridge"), { ssr: false });

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bridge DEMO</title>
        <link rel="icon" href="/coins.png" />
      </Head>

      <main className={styles.main}>
        <MetaMaskCard />
        <Bridge />
      </main>
    </div>
  );
};

export default Home;
