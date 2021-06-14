import fs from "fs";
import axios from "axios";

import Utils from "./pdfUtils";
import { BasePdf } from "./models/basePdf";
import { StoredPdf } from "./models/storedPdf";

const baseDir = "temp/";
var path = require("path");

export class UserRouteHandler {
  constructor() {
    if (!fs.existsSync(baseDir)) {
      console.log("Creating directory");
      fs.mkdirSync(baseDir);
    }
  }

  async processPDF(createPdfRequest: BasePdf) {
    let status = false;
    try {
      //console.log(createPdfRequest.pdf_url);
      await Utils.downloadPDF(createPdfRequest.pdf_url, createPdfRequest.name);

      await Utils.generateThumbnail(createPdfRequest.name, "thumbnail.png");
      //Utils.validatePDF(createPdfRequest.name)
      status = true;
    } catch (e: unknown) {
      console.log("Exception while creating pdf", e);
    }

    //webhook post completion
    console.log("Executing webhook");
    axios
      .post("http://localhost:3003/prcoessingComplete", {
        PDFUploaded: status,
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  async fetchPDF(): Promise<Array<StoredPdf>> {
    const directories = await fs.promises.readdir(baseDir);
    let results: Array<StoredPdf> = new Array();
    try {
      for (var i = 0; i < directories.length; i++) {
        const files = await fs.promises.readdir(baseDir + directories[i]);
        let pdfFile;
        let thumbnailFile;
        for (const file of files) {
          if (file.includes(".pdf")) {
            pdfFile = file;
          } else {
            thumbnailFile = file;
          }
        }
        var storedPdf = new StoredPdf(
          path.resolve(baseDir + directories[i], thumbnailFile),
          path.resolve(baseDir + directories[i], pdfFile)
        );
        results.push(storedPdf);
      }
    } catch (e: unknown) {
      console.log(e);
    }

    return results;
  }
}
