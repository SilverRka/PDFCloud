export class StoredPdf {
  thumbanil_url: string;
  pdf_url: string;
  constructor(thumbanil_url: string, pdf_url : string){
      this.pdf_url = pdf_url;
      this.thumbanil_url = thumbanil_url;
  }
}