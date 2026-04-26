"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function addPost(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  await supabase.from("blog_posts").insert({
    slug,
    title,
    excerpt:   formData.get("excerpt")  as string,
    content:   formData.get("content")  as string,
    category:  formData.get("category") as string,
    cover:     formData.get("cover")    as string || "/hero.jpg",
    read_min:  parseInt(formData.get("read_min") as string) || 3,
    published: formData.get("published") === "true",
    date:      new Date().toISOString().split("T")[0],
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(id: number, formData: FormData) {
  const supabase = await createClient();
  await supabase.from("blog_posts").update({
    title:     formData.get("title")    as string,
    excerpt:   formData.get("excerpt")  as string,
    content:   formData.get("content")  as string,
    category:  formData.get("category") as string,
    cover:     formData.get("cover")    as string || "/hero.jpg",
    read_min:  parseInt(formData.get("read_min") as string) || 3,
    published: formData.get("published") === "true",
  }).eq("id", id);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deletePost(id: number) {
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
