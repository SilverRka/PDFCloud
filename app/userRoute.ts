import {CommonRoutesConfig} from './common/routes/config'
import express from 'express';
import { BasePdf } from './models/BasePdf';
import { UserRouteHandler } from './UserRouteHandler';
export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'pdfRoutes');
    }

    configureRoutes() {
        this.app.route('/pdf')
        .get((req: express.Request, res: express.Response) => {
            var userRouteHandler = new UserRouteHandler();
            userRouteHandler.fetchPDF()
            .then(response => {
                return res.status(200).send(response)});
            })
        .post((req: express.Request, res: express.Response) => {
            const createPdf : BasePdf = req.body;
            var userRouteHandler = new UserRouteHandler();
            userRouteHandler.processPDF(createPdf)

            return res.status(200).send("PDF processing is in progress");
        });
        return this.app;
    }
}