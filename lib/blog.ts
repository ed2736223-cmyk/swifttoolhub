export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
};

export const posts: Post[] = [
 
 
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
