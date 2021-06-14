import Utils from './PdfUtils'
import express from 'express';
import { BasePdf } from './models/BasePdf';
import { StoredPdf } from './models/StoredPdf';
import { IncomingMessage } from 'http';

const fs = require("fs");
const baseDir = "temp/";
const axios = require('axios').default;
var path = require("path");
//import fileUrl from 'file-url';

export class UserRouteHandler {

    constructor () {
        if (!fs.existsSync(baseDir)){
            console.log("Creating directory");
            fs.mkdirSync(baseDir);
        }
    }

   async processPDF(createPdfRequest  : BasePdf) {
        let status = false;
        try {
            //console.log(createPdfRequest.pdf_url);
            await Utils.downloadPDF(createPdfRequest.pdf_url, createPdfRequest.name);
            var thumbnailName = "thumbnail.png"
            
            await Utils.generateThumbnail(createPdfRequest.name, 'thumbnail.png')
            //Utils.validatePDF(createPdfRequest.name)
            status = true;
           } catch(e: unknown) {
               console.log("Exception while creating pdf", e);
           }

           //webhook post completion
           console.log("Executing webhook");
           axios.post('http://localhost:3000/prcoessingComplete', {
            pdfName: createPdfRequest.name,
            PDFUploaded: status
          })
          .then(function (response : IncomingMessage) {
            //console.log("response for webhook", response);
          })
          .catch(function (error : any) {
            console.log(error);
          });           
    }

     async fetchPDF() : Promise<Array<StoredPdf>> {
        const directories = await fs.promises.readdir(baseDir);
        let results:Array<StoredPdf> = new Array();
        try {
        for(var i = 0; i < directories.length; i++) 
            {
            const files =  await fs.promises.readdir(baseDir + directories[i]);
            var pdfFile ;
            var thumbnailFile;
            for (const file of files) {
                if(file.includes(".pdf")) {
                    pdfFile = file;
                }
                else {
                    thumbnailFile = file;
                }
            }
            var storedPdf = new StoredPdf(path.resolve(baseDir + directories[i], thumbnailFile),path.resolve(baseDir + directories[i], pdfFile));
            results.push(storedPdf);
            };
        }catch(e : unknown) {
            console.log(e);
        }; 

    return results;
    }
}   