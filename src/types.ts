export interface User {
  id: string;
  plan: 'free' | 'pro' | 'premium';
  usage_count: number;
}

export interface Project {
  id: string;
  user_id: string;
  type: 'video' | 'short' | 'design';
  title: string;
  content: string; // JSON stringified
  created_at: string;
}

export interface Plan {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: string;
  features: string[];
  limit: string;
}
