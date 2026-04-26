import { createClient } from "@/lib/supabase-server";
import BlogClient from "./BlogClient";

export const revalidate = 0;

export default async function AdminBlog() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  return <BlogClient initialPosts={data ?? []} />;
}
