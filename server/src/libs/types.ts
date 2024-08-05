export interface WebSource {
  title: string;
  url: string;
  content: string;
}

export interface ImageSource {
  title: string;
  url: string;
  image: string;
}

export type Message = {
  id: string;
  createdAt?: Date;
  question: string;
  content: string;
  sources?: WebSource[];
  related?: string;
  images?: ImageSource[];
};

export interface HybridSearchResult {
  question: string;
  answer: string;
  webs: WebSource[];
  images: ImageSource[];
  related: string;
}

export interface StreamHandler {
  (message: string | null, done: boolean): void;
}
