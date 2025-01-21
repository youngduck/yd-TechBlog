import { Post } from "../interfaces/posts";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import RSS from "rss";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(decodeURIComponent(fullPath), "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getFilteredPosts(filterWord: string): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  let filteredPost = posts.filter(
    (post) => post.category === decodeURIComponent(filterWord)
  );
  return filteredPost;
}

export function getAllCategoriesArray(): any {
  const posts = getAllPosts();
  const categoryMap = new Map();

  categoryMap.set("All Posts", posts.length);
  posts.map((item) => {
    const category = item.category;
    categoryMap.has(category)
      ? categoryMap.set(category, categoryMap.get(category) + 1)
      : categoryMap.set(category, 1);
  });

  return Array.from(categoryMap.entries());
}

export function getAllCategoriesID(): string[] {
  const posts = getAllPosts();
  const categoryMap = new Map();

  categoryMap.set("All Posts", posts.length);
  posts.map((item) => {
    const category = item.category;
    categoryMap.has(category)
      ? categoryMap.set(category, categoryMap.get(category) + 1)
      : categoryMap.set(category, 1);
  });

  return Array.from(categoryMap.keys());
}

export async function getAllScrapList() {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      },
      body: JSON.stringify({ page_size: 100 }),
    }
  );
  console.log("이게왜", NOTION_DATABASE_ID);
  const responseData = await response.json();
  const dummy = responseData.results.map((item: any) => item.properties);
  console.log(dummy, "dummy");
  return responseData;
}

export const generateRSS = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASED_URL;

  try {
    const posts = getAllPosts();

    const feed = new RSS({
      title: "김영덕 기술블로그",
      description: "천천히 기록해나가는 개발일지입니다.",
      copyright: "All rights reserved 2024, Kim YoungDuck",
      feed_url: `${baseUrl}/rss.xml`,
      site_url: baseUrl as string,
      language: "ko",
      pubDate: new Date(),
    });

    posts.forEach((post) => {
      const url = `${baseUrl}/posts/${post.slug}`;

      feed.item({
        title: post.title,
        url,
        description: post.excerpt,
        author: "김영덕",
        guid: url,
        date: new Date(post.date.replace("/", "-")),
        custom_elements: [{ "content:encoded": post.content }],
      });
    });

    return feed.xml();
  } catch (err) {
    console.error("Error generating Rss feed", err);
    return null;
  }
};
