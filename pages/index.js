import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[slug].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

const rgb = [100, 50, 0];


function setContrast() {
	// Randomly update colours
	rgb[0] = Math.round(Math.random() * 255);
	rgb[1] = Math.round(Math.random() * 255);
	rgb[2] = Math.round(Math.random() * 255);
  
	// http://www.w3.org/TR/AERT#color-contrast
	const brightness = Math.round(((parseInt(rgb[0]) * 299) +
						(parseInt(rgb[1]) * 587) +
						(parseInt(rgb[2]) * 114)) / 1000);
	const textColour = (brightness > 125) ? '#202020' : '#e7e7e7';
	const backgroundColour = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	return {textColour:textColour, backgroundColour:backgroundColour }
  }
  let Vals = setContrast();



export default function Home({ posts }) {
	return (
		<div>
			<Head>
				<title>Boring Book Club</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<div className="grid-layout">
				<div className="grid-item span-12" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }} >
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
					let Vals = setContrast();
				  
					return (
						<div key={post.id} className="grid-item span-2" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }} >
							<Link href={`/${post.properties.slug.rich_text[0]?.plain_text}`}>
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
					<div className="grid-item span-12" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }} >
						<a href="mailto:contact@printerscanner.net">
							contact@printerscanner.net
						</a>
					</div>
					<div className="grid-item span-12" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }}><a href="https://instagram.com/printer_scanner">Instagram</a></div>
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
