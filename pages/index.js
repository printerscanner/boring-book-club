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
			<div className="grid-layout condensed-grid">
				<div className="grid-item"><Link href="/"><h1 className="logo">the blog</h1></Link></div>
				<div className="grid-item span-3"></div>
				<div className="grid-item grid-item--link">
					<a className="right" href="https://instagram.com/printer_scanner">
						Instagram
					</a>
				</div>
				<div className="grid-item grid-item--link"><a href="https://printerscanner.net">↗ printer_scanner</a></div>
			</div>
			<div className="grid-layout">
				<div className="grid-item span-2 about">
					<p>The <b>printer_scanner</b> blog aims to solve the worlds toughest questions through thoughtful, reasoned dialog.</p>

					<p>printer_scanner is run by the multi-award winning graphic designer, <a href="https://abbeyyacoe.info">abbey</a>. We explore themes related to printing and scanning.</p>

					<p>This blog is built with Notion as the backend. You can take a look at the database <a href="https://www.notion.so/printer-scanner/d6acfbec7b734db09375cf20d5298db2?v=9ce0c0a99a824a949a6e328b32b7262a">here</a>.</p>

					<p>
						If you have a complaint, or would like to get in touch, our email is <a href="mailto:contact@printerscanner.net"> contact@printerscanner.net</a>. You can also find us on <a href="https://instagram.com/printer_scanner">Instagram</a>.
					</p>
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
						<div key={post.id} className="grid-item">
							<Link href={`/${post.id}`}>
								<h2>
									<Text text={post.properties.Name.title} />
								</h2>

								<p className="date">{date}</p>
								<p>Read post →</p>
							</Link>
						</div>
					);
				})}
			</div>
			<footer>
				<br />
				<div className="grid-layout condensed-grid">
					<div className="grid-item">
						<a href="mailto:contact@printerscanner.net">
							contact@printerscanner.net
						</a>
					</div>
					<div className="grid-item span-4"></div>
					<div className="grid-item"><a className="right" href="https://instagram.com/printer_scanner">Instagram</a></div>
				</div>
				<br />
			</footer>
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
