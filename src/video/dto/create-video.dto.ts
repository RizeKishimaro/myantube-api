export class CreateVideoDto {
  title: string;
  description: string;
  duration: number;
  urlHd: string;
  originalUrl: string; 
  urlSd: string;
  poster: string;
  url: string;
  oauthUserId?: string;
  userId: string;
}
