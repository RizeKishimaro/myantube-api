import { Injectable } from "@nestjs/common";
import * as getFbVideoInfo from "fb-downloader-scrapper";
@Injectable()
export class FactoryService {
  async scrapFacebookURL(fbUrl: string) {
    if (!fbUrl) {
      console.log("Please provide a Facebook video URL.");
      process.exit(1);
    }

    const facebookURL = await getFbVideoInfo(fbUrl)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
    return facebookURL;
  }
}
