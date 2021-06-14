import { CommonRoutesConfig } from "./common/routes/config";
import express from "express";
import { BasePdf } from "./models/basePdf";
import { UserRouteHandler } from "./routeHandler";
export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "pdfRoutes");
  }

  configureRoutes() {
    this.app
      .route("/pdf")
      .get((req: express.Request, res: express.Response) => {
        let userRouteHandler = new UserRouteHandler();
        userRouteHandler.fetchPDF().then((response) => {
          return res.status(200).send(response);
        });
      })
      .post((req: express.Request, res: express.Response) => {
        const createPdf: BasePdf = req.body;
        let userRouteHandler = new UserRouteHandler();
        userRouteHandler.processPDF(createPdf);

        return res.status(200).send("PDF processing is in progress");
      });
    // to accept the webhook, created this to show webhook is working
    this.app
      .route("/prcoessingComplete")
      .post((req: express.Request, res: express.Response) => {
        console.log("PDF status is", req.body.PDFUploaded);
        return res.status(200);
      });
    return this.app;
  }
}
