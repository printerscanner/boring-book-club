import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

const randomClass = (value) => {
	return Math.floor(Math.random() * value);
};

export default function Home({ posts }) {
	return (
		<div>
			<Head>
				<title>Boring Book Club</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<div className="grid-layout">
				<div className="grid-item span-2">
					<div><Link href="/"><h1 className="">boring book club</h1></Link></div>
					<a href="https://printerscanner.net">by printer_scanner</a>
					<div>
						<a href="/2ae8ba85-f712-4e52-80e0-57ddc64cf1fa">about</a>
					</div>

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
						<div key={post.id} className="grid-item" style={{gridColumnEnd: "span " + randomClass(3), gridRowEnd: "span " + randomClass(3)}} >
							<Link href={`/${post.id}`}>
								<h2>
									<Text text={post.properties.Name.title} />
								</h2>
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
