export interface Project {
  id: string;
  name: string;
  client: string;
  description?: string;
  status: string;
  progress: number;
  specs: string[];
  thumbnail_url: string;
  slug: string;
  sandbox_url?: string;
  sandbox_file_url?: string;
}
