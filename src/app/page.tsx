import { getAllPosts } from "@/lib/api";
import PostCard from "./_components/post/post-card/post-card";
import TagNavbar from "@layout/tag-navbar";
import PostCards from "./_components/post/post-cards/post-cards";
import ScrapList from "./_components/layout/scrap-list/scrap-list";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="lg:w-[1150px] h-auto mx-auto">
      <div className="flex flex-col justify-center items-center">
        <TagNavbar />
        <ScrapList />
        <PostCards posts={posts} />
      </div>
    </main>
  );
}
