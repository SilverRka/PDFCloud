import * as https from "https";
import fs from "fs";
import pdf from "pdf-thumbnail";

const baseDir = "temp/";
export default class Utils {
  static async downloadPDF(pdfURL: string, outputFilename: string) {
    let dir = baseDir + outputFilename.slice(0, -4);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      throw new Error("Duplicate File");
    }
    let completePath = dir + "/" + outputFilename;
    const file = fs.createWriteStream(completePath);
    await new Promise((resolve, reject) => {
      https.get(pdfURL, (response) => {
        response.pipe(file);
        resolve(response);
        file.on("error", function (err: any) {
          console.log(err);
          reject(response);
        });
      });
    });
  }

  static async generateThumbnail(
    pdfFilename: string,
    outputThumbnailFile: string
  ) {
    let dir = baseDir + pdfFilename.slice(0, -4);
    let completePath = dir + "/" + pdfFilename;

    let pdfBuffer = fs.readFileSync(completePath);

    let thumbnailCompletePath = dir + "/" + outputThumbnailFile;
    const file = fs.createWriteStream(thumbnailCompletePath);
    console.log(
      "Generating thumbnail from the pdf  " + outputThumbnailFile + "..."
    );
    let thumbNail = await pdf(pdfBuffer).then((value: any) => {
      value.pipe(file);
      file.on("error", function (err: any) {
        console.log(err);
      });
    });
  }
}
