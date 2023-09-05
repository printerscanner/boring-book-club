import { Fragment } from "react";
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../lib/notion";
import Link from "next/link";
import { databaseId } from "./index.js";
import styles from "./post.module.css";

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


export const Text = ({ text }) => {
	if (!text) {
		return null;
	}
	return text.map((value) => {
		const {
			annotations: { bold, code, color, italic, strikethrough, underline },
			text,
		} = value;
		return (
			<span
				className={[
					bold ? styles.bold : "",
					code ? styles.code : "",
					italic ? styles.italic : "",
					strikethrough ? styles.strikethrough : "",
					underline ? styles.underline : "",
				].join(" ")}
				style={color !== "default" ? { color } : {}}
			>
				{text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
			</span>
		);
	});
};

const renderNestedList = (block) => {
	const { type } = block;
	const value = block[type];
	if (!value) return null;

	const isNumberedList = value.children[0].type === "numbered_list_item";

	if (isNumberedList) {
		return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
	}
	return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
	const { type, id } = block;
	const value = block[type];

	switch (type) {
		case "paragraph":
			return (
				<p>
					<Text text={value.rich_text} />
				</p>
			);
		case "heading_1":
			return (
				<h1>
					<Text text={value.rich_text} />
				</h1>
			);
		case "heading_2":
			return (
				<h2>
					<Text text={value.rich_text} />
				</h2>
			);
		case "heading_3":
			return (
				<h3>
					<Text text={value.rich_text} />
				</h3>
			);
		case "bulleted_list_item":
		case "numbered_list_item":
			return (
				<li>
					<Text text={value.rich_text} />
					{!!value.children && renderNestedList(block)}
				</li>
			);
		case "to_do":
			return (
				<div>
					<label htmlFor={id}>
						<input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
						<Text text={value.rich_text} />
					</label>
				</div>
			);
		case "toggle":
			return (
				<details>
					<summary>
						<Text text={value.rich_text} />
					</summary>
					{value.children?.map((block) => (
						<Fragment key={block.id}>{renderBlock(block)}</Fragment>
					))}
				</details>
			);
		case "child_page":
			return <p>{value.title}</p>;
		case "image":
			const src =
				value.type === "external" ? value.external.url : value.file.url;
			const caption = value.caption ? value.caption[0]?.plain_text : "";
			return (
				<figure>
					<img src={src} alt={caption} />
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
			);
		case "divider":
			return <hr key={id} />;
		case "quote":
			return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
		case "code":
			return (
				<pre className={styles.pre}>
					<code className={styles.code_block} key={id}>
						{value.rich_text[0].plain_text}
					</code>
				</pre>
			);
		case "file":
			const src_file =
				value.type === "external" ? value.external.url : value.file.url;
			const splitSourceArray = src_file.split("/");
			const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
			const caption_file = value.caption ? value.caption[0]?.plain_text : "";
			return (
				<figure>
					<div className={styles.file}>
						📎{" "}
						<Link href={src_file} passHref>
							{lastElementInArray.split("?")[0]}
						</Link>
					</div>
					{caption_file && <figcaption>{caption_file}</figcaption>}
				</figure>
			);
		case "bookmark":
			const href = value.url;
			return (
				<a href={href} target="_brank" className={styles.bookmark}>
					{href}
				</a>
			);
		default:
			return `❌ Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type
				})`;
	}
};

export default function Post({ page, blocks }) {
	if (!page || !blocks) {
		return <div />;
	}
	return (
		<div className={styles.content} >
			<Head>
				<title>{page.properties.Name.title[0].plain_text}</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<div>
				<div className="grid-layout condensed-grid">
					<div className="grid-item span-2" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }}><Link href="/"><h1 className="logo">boring books</h1></Link>
						<a href="https://printerscanner.net">by printer_scanner</a>
						<div>
							<a href="/about">about</a>
						</div>
					</div>
				</div>
			</div>
			<div className="grid-layout" style={{ flexGrow: 1 }}>
			<div className="grid-item" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }}>
			<article className={styles.container}>
				<Link href="/" className={styles.back}>
					←
				</Link>
				<h1 className={styles.name}>
					<Text text={page.properties.Name.title} />
					<p style={{fontSize: '15px'}}>{page.properties.Year && page.properties.Year.rich_text[0].plain_text}</p>
				</h1>
				<section>
					{blocks.map((block) => (
						<Fragment key={block.id}>{renderBlock(block)}</Fragment>
					))}
				</section>
			</article>
			</div>
			</div>
			<footer>
				<div className="grid-layout condensed-grid" >
					<div className="grid-item" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }}>
						<a href="mailto:contact@printerscanner.net">
							contact@printerscanner.net
						</a>
					</div>
					<div className="grid-item" style={{ backgroundColor: Vals.backgroundColour, color: Vals.textColour }}><a className="right" href="https://instagram.com/printer_scanner">Instagram</a></div>
				</div>
			</footer>
		</div>
	);
}

export const getStaticPaths = async () => {
	const database = await getDatabase(databaseId);
	return {
		paths: database.map((page) => ({ params: { slug: page.properties.slug.rich_text[0]?.plain_text } })),
		fallback: true,
	};
};

export const getStaticProps = async (context) => {
	const { slug } = context.params;
	const database = await getDatabase(databaseId);
	const id = database.find((post) => post.properties.slug.rich_text[0]?.plain_text === slug).id;
	const page = await getPage(id);
	const blocks = await getBlocks(id);

	// Retrieve block children for nested blocks (one level deep), for example toggle blocks
	// https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
	const childBlocks = await Promise.all(
		blocks
			.filter((block) => block.has_children)
			.map(async (block) => {
				return {
					id: block.id,
					children: await getBlocks(block.id),
				};
			})
	);
	const blocksWithChildren = blocks.map((block) => {
		// Add child blocks if the block should contain children but none exists
		if (block.has_children && !block[block.type].children) {
			block[block.type]["children"] = childBlocks.find(
				(x) => x.id === block.id
			)?.children;
		}
		return block;
	});

	return {
		props: {
			page,
			blocks: blocksWithChildren,
		},
		revalidate: 1,
	};
};
