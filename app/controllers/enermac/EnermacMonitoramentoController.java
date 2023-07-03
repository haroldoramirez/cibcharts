package controllers.enermac;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import models.enermac.Estatistica;
import models.enermac.MonitoramentoParametro;
import play.Logger;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.Calendar;
import java.util.List;

public class EnermacMonitoramentoController extends Controller {

    private EbeanServer gestaoDB = Ebean.getServer("enermac");

    /**
     * Retrieve a list of all objs
     *
     * @return a list of all objs in json
     */
    public Result buscaTodos() {
        try {

            return ok(Json.toJson(gestaoDB.find(MonitoramentoParametro.class)
                    .findList()));

        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
    }

    /**
     * Retrieve the last object on database
     *
     * @return a list
     */
    public Result last() {

        try {

            return ok(Json.toJson(gestaoDB.find(MonitoramentoParametro.class)
            .orderBy("id desc")
            .setMaxRows(1).findUnique()));

        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
    }

    public Result lastEstatistica() {

        try {

            return ok(Json.toJson(gestaoDB.find(Estatistica.class)
                    .orderBy("id desc")
                    .setMaxRows(1).findUnique()));

        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
    }

    /**
     * Save obj from json request
     *
     * @return a status 200 with created()
     */
    public Result inserirEstatistica() {

        Estatistica estatistica = Json.fromJson(request().body().asJson(), Estatistica.class);

        estatistica.setDataRegistro(Calendar.getInstance());

        try {

            //Salva o objeto
            gestaoDB.save(estatistica);

        } catch (Exception e) {
            return badRequest();
        }

        return created(Json.toJson(estatistica));
    }

    public Result buscaTodasEstatisticas() {

        try {

            List<Estatistica> estatisticas = gestaoDB.find(Estatistica.class).findList();

            return ok(Json.toJson(estatisticas));

        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
    }
}
