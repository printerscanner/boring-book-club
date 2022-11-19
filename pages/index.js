import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>printer_scanner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
			<div>
				<div className="grid-layout condensed-grid">
					<div className="grid-item span-2"><Link href="/"><h1 className="logo">the printer_scanner blog</h1></Link></div>
					<div class="grid-item span-2"></div>
					<div className="grid-item grid-item--link">
						<a className="right" href="https://instagram.com/printer_scanner">
							Instagram
						</a>
					</div>
					<div class="grid-item grid-item--link"><a href="https://printerscanner.net">↗ printer_scanner</a></div>
				</div>
			</div>
			<div className="grid-layout">
				<div class="grid-item span-2">
					  <p>From the minds that brought you printer_scanner, introducing the printer_scanner blog.</p>
				</div>
				{posts.map((post) => {
					const date = new Date(post.created_time).toLocaleString(
						"en-US",
						{
							month: "short",
							day: "2-digit",
							year: "numeric",
						}
					);
					return (
						<div key={post.id} className="grid-item span-2">
							<Link href={`/${post.id}`}>
							<h2>
								<Text text={post.properties.Name.title} />
							</h2>

								<p>{date}</p>
								<p>Read post →</p>
							</Link>
						</div>
					);
				})}
			</div>
    </main>
  </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
