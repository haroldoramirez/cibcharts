package controllers;

import it.innove.play.pdf.PdfGenerator;
import play.Logger;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import secured.SecuredAdmin;

import javax.inject.Inject;

@Security.Authenticated(SecuredAdmin.class)
public class PdfController extends Controller {

    @Inject
    public PdfGenerator pdfGenerator;

    public Result create() {
        Logger.info("Criar PDF - Backend");
        return ok(pdfGenerator.toBytes(views.html.pdf.render("Your new application is ready."), "http://localhost:9000")).as("application/pdf");
    }
}
