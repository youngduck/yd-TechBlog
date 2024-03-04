import React from "react";
import { getPostBySlug, getAllPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CMS_NAME } from "../../../lib/constants";
import MarkdownPost from "@/app/_components/markdown-post";

interface Params {
  params: {
    slug: string;
  };
}

const Page: React.FC<Params> = async ({ params }) => {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return notFound();
  }

  return (
    <main className="lg:w-[1150px] mx-auto">
      <article>
        <MarkdownPost post={post} />
      </article>
      <nav>목차</nav>
    </main>
  );
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASED_URL as string),
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default Page;
