import { request } from 'http';
import * as https from 'https'
const fs = require("fs");
const pdf = require('pdf-thumbnail');
const baseDir = "temp/";
var gm = require('gm');

export default class Utils {

    static async downloadPDF(pdfURL: string, outputFilename : string) {
        var dir = baseDir + outputFilename.slice(0, -4);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        } else {
            throw new Error("Duplicate File");
        }
        let completePath = dir + "/" + outputFilename;
        const file = fs.createWriteStream(completePath);
        await new Promise((resolve, reject) => {
            //var body = ''; 
            https.get(pdfURL, (response) => {
                //console.log("response for pdfBufffer", body);
                response.pipe(file)
                resolve(response);            
                file.on("error", function(err : any){
                    console.log(err)
                    reject(response);
                });
            });
        });
    }

    static async generateThumbnail(pdfFilename : string, outputThumbnailFile : string) { 
        var dir = baseDir + pdfFilename.slice(0, -4);
        let completePath = dir + "/" + pdfFilename;

        let pdfBuffer = fs.readFileSync(completePath);

        let thumbnailCompletePath = dir + "/" + outputThumbnailFile;
        const file = fs.createWriteStream(thumbnailCompletePath);
        console.log("Generating thumbnail from the pdf " + outputThumbnailFile + "...");
        let thumbNail = await pdf(pdfBuffer).then((value : any) => {
            //console.log(value)
            value.pipe(file)
            file.on("error", function(err : any){
                console.log(err)
            })
            //console.log(value);
          });
    }

    // static async validatePDF(currentPDFFileName : String) : Promise<boolean> {
    //     let completePath = baseDir + "/" + currentPDFFileName.slice(0, -4) + "/" + currentPDFFileName;
    //     let pdfBuffer = fs.readFileSync(completePath);
    //     //console.log(pdfBuffer);

    //     return true;
    // }
}