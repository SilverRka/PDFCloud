"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
var config_1 = require("./common/routes/config");
var UserRouteHandler_1 = require("./UserRouteHandler");
var UsersRoutes = /** @class */ (function (_super) {
    __extends(UsersRoutes, _super);
    function UsersRoutes(app) {
        return _super.call(this, app, 'pdfRoutes') || this;
    }
    UsersRoutes.prototype.configureRoutes = function () {
        this.app.route('/pdf')
            .get(function (req, res) {
            var userRouteHandler = new UserRouteHandler_1.UserRouteHandler();
            userRouteHandler.fetchPDF()
                .then(function (response) {
                return res.status(200).send(response);
            });
        })
            .post(function (req, res) {
            var createPdf = req.body;
            var userRouteHandler = new UserRouteHandler_1.UserRouteHandler();
            userRouteHandler.processPDF(createPdf);
            return res.status(200).send("PDF processing is in progress");
        });
        this.app.route('/prcoessingComplete')
            .post(function (req, res) {
            console.log("PDF status is", req.body.PDFUploaded);
            return res.status(200);
        });
        return this.app;
    };
    return UsersRoutes;
}(config_1.CommonRoutesConfig));
exports.UsersRoutes = UsersRoutes;
