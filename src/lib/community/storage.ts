export interface CommunityPost {
  id: string;
  hunt_id: string;
  hunter_name: string;
  species: string;
  date: string;
  location: string;
  trophy_measurement: string;
  distance_m: number;
  rifle: string;
  ammo: string;
  notes: string;
  photo?: string;
  likes: number;
  posted_at: number;
}

const LS_KEY = "trophyhunt_community_v1";

export function getPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addPost(post: CommunityPost): void {
  try {
    const posts = getPosts();
    localStorage.setItem(LS_KEY, JSON.stringify([post, ...posts]));
  } catch { /* ignore */ }
}

export function toggleLike(postId: string): void {
  try {
    const posts = getPosts();
    const liked = JSON.parse(localStorage.getItem("trophyhunt_liked_v1") ?? "[]") as string[];
    const alreadyLiked = liked.includes(postId);
    const updatedLiked = alreadyLiked ? liked.filter(id => id !== postId) : [...liked, postId];
    const updatedPosts = posts.map(p => p.id === postId ? { ...p, likes: p.likes + (alreadyLiked ? -1 : 1) } : p);
    localStorage.setItem("trophyhunt_community_v1", JSON.stringify(updatedPosts));
    localStorage.setItem("trophyhunt_liked_v1", JSON.stringify(updatedLiked));
  } catch { /* ignore */ }
}

export function getLiked(): string[] {
  try { return JSON.parse(localStorage.getItem("trophyhunt_liked_v1") ?? "[]"); } catch { return []; }
}