import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

const randomClass = (value) => {
	return Math.floor(Math.random() * value);
};

const randomColor = () => {
	return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
}

export default function Home({ posts }) {
	return (
		<div>
			<Head>
				<title>Boring Book Club</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<div className="grid-layout">
				<div className="grid-item span-12" style={{ backgroundColor: randomColor() }} >
					<div><Link href="/"><h1 className="">boring book club</h1></Link></div>
					<a href="https://printerscanner.net">by printer_scanner</a>
					<div>
						<a href="/2ae8ba85-f712-4e52-80e0-57ddc64cf1fa">about</a>
					</div>

			</div>
				{posts.map((post, i) => {
					const date = new Date(post.created_time).toLocaleString(
						"en-US",
						{
							month: "short",
							day: "2-digit",
							year: "numeric",
						}
					);
					return (
						<div key={post.id} className="grid-item span-12" style={{backgroundColor: randomColor()}} >
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
				<div className="grid-layout condensed-grid">
					<div className="grid-item" style={{ backgroundColor: randomColor() }} >
						<a href="mailto:contact@printerscanner.net">
							contact@printerscanner.net
						</a>
					</div>
					<div className="grid-item" style={{ backgroundColor: randomColor() }} ><a className="right" href="https://instagram.com/printer_scanner">Instagram</a></div>
				</div>
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
