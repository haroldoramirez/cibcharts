package controllers.monitoramento;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import controllers.LogController;
import daos.UsuarioDAO;
import daos.monitoramento.PropriedadeDAO;
import models.BaseCalculadaDia;
import models.Propriedade;
import models.Usuario;
import play.Logger;
import play.data.Form;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import secured.SecuredAdmin;
import validators.monitoramento.BaseCalculadaDiaFormData;
import views.html.admin.monitoramento.basecalculadadia.list;

import javax.inject.Inject;
import java.util.*;

import static play.data.Form.form;

public class BaseCalculadaDiaController extends Controller {

    static private LogController logController = new LogController();

    private String mensagem;
    private String tipoMensagem;

    @Inject
    private UsuarioDAO usuarioDAO;

    private Optional<Usuario> usuarioAtual() {
        String email = session().get("email");
        Optional<Usuario> possivelUsuario = usuarioDAO.comEmail(email);
        return possivelUsuario;
    }

    @Inject
    private PropriedadeDAO propriedadeDAO;

    /**
     * Retrieve a list of all objects
     *
     * @return a list of all objects in a render template
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result telaLista(int page, String sortBy, String order, String filter) {
        try {
            return ok(
                    list.render(
                            BaseCalculadaDia.page(page, 13, sortBy, order, filter),
                            sortBy, order, filter
                    )
            );
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * @return render edit form with a data
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result telaEditar(Long id) {

        try {
            //logica onde instanciamos um objeto atraves do ID que esteja cadastrado na base de dados
            BaseCalculadaDiaFormData formDataCalculadaDia = (id == 0) ? new BaseCalculadaDiaFormData() : models.BaseCalculadaDia.makeBaseCalculadaDiaFormData(id);

            //apos o objeto ser instanciado passamos os dados para o eventoformdata e os dados serao carregados no form edit
            Form<BaseCalculadaDiaFormData> formData = form(BaseCalculadaDiaFormData.class).fill(formDataCalculadaDia);

            return ok(views.html.admin.monitoramento.basecalculadadia.edit.render(id,formData));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * @param propriedade nome da propriedade
     *
     * @return a list of all objects in a json
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result listarAnos(String propriedade){

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        ArrayList<Integer> listaAnos = new ArrayList<>();

        if (possivelPropriedadeSelecionada.isPresent()) {
            for (BaseCalculadaDia baseCalculadaDia : Ebean.find(BaseCalculadaDia.class)
                    .order()
                    .asc("ano")
                    .where().eq("propriedade_id", possivelPropriedadeSelecionada.get().getId()).findList()) {
                listaAnos.add(baseCalculadaDia.getAno());
            }
        }

        Set<Integer> anos = new LinkedHashSet<>(listaAnos);

        return ok(Json.toJson(anos));
    }

    /**
     * @param propriedade nome da propriedade
     * @param ano ano da propriedade
     *
     * @return a list of all objects in a json
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result listarMeses(String propriedade, Integer ano){

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        ArrayList<Integer> listaMeses = new ArrayList<>();

        if (possivelPropriedadeSelecionada.isPresent()) {
            for (BaseCalculadaDia baseCalculadaDia : Ebean.find(BaseCalculadaDia.class)
                    .order()
                    .asc("mes")
                    .where()
                    .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                    .eq("ano", ano).findList()) {
                listaMeses.add(baseCalculadaDia.getMes());
            }
        }

        Set<Integer> meses = new LinkedHashSet<>(listaMeses);

        return ok(Json.toJson(meses));
    }

    /**
     * @param propriedade nome da propriedade
     * @param ano ano da propriedade
     * @param mes mes da propriedade
     *
     * @return a list of all objects in a json
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result listarDias(String propriedade, Integer ano, Integer mes){

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        ArrayList<Integer> listaDias = new ArrayList<>();

        if (possivelPropriedadeSelecionada.isPresent()) {
            for (BaseCalculadaDia baseCalculadaDia : Ebean.find(BaseCalculadaDia.class)
                    .order()
                    .desc("dia")
                    .where()
                    .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                    .eq("ano", ano)
                    .eq("mes", mes).findList()) {

                listaDias.add(baseCalculadaDia.getDia());

            }
        }

        return ok(Json.toJson(listaDias));
    }

    /**
     * @param propriedade nome da propriedade
     * @param ano ano da propriedade
     * @param mes mes da propriedade
     * @param dia dia da propriedade
     *
     * @return a list of all objects in a json filtered by propriedade ano mes dia
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result filtrarDias(String propriedade, Integer ano, Integer mes, Integer dia) {

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        if (possivelPropriedadeSelecionada.isPresent()) {

            BaseCalculadaDia baseCalculadaDia = Ebean.find(BaseCalculadaDia.class).where()
                    .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                    .eq("ano", ano)
                    .eq("mes", mes)
                    .eq("dia", dia).findUnique();

            return ok(Json.toJson(baseCalculadaDia));

        }

        return notFound();
    }

    /*Editar objeto atraves do seu ID*/
    @Security.Authenticated(SecuredAdmin.class)
    public Result editar(Long id) {
        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Resgata os dados do formulario atraves de uma requisicao
        Form<BaseCalculadaDiaFormData> formData = form(BaseCalculadaDiaFormData.class).bindFromRequest();

        //verificar se tem erros no formData, caso tiver erros retorna o formulario com os erros caso não tiver, continua o processo de alteracao do objeto
        if (formData.hasErrors()) {
            return badRequest(views.html.admin.monitoramento.basecalculadadia.edit.render(id,formData));
        } else {
            try {
                BaseCalculadaDia buscaObj = Ebean.find(BaseCalculadaDia.class, id);

                if (buscaObj == null) {
                    return notFound(views.html.mensagens.erro.naoEncontrado.render("não encontrado"));
                }

                //Converte os dados do formulario para uma instancia do objeto
                BaseCalculadaDia baseCalculadaDia = BaseCalculadaDia.makeInstance(formData.get());

                baseCalculadaDia.setId(id);
                baseCalculadaDia.setDataAlteracao(Calendar.getInstance());
                baseCalculadaDia.update();

                /*Se existir um usuario presente, registre o log no sistema*/
                if (usuarioAtual().isPresent()) {
                    formatter.format("Usuário: '%1s' atualizou um registro: '%2s'.", usuarioAtual().get().getEmail(), baseCalculadaDia.getPropriedade().getNome());
                    logController.inserir(sb.toString());
                }

                flash("info", "Indicador do dia '" + baseCalculadaDia.getDia() + "' da Propriedade " + baseCalculadaDia.getPropriedade().getNome() + " foi atualizada.");
                return redirect(controllers.monitoramento.routes.BaseCalculadaDiaController.telaLista(0, "indicador", "asc", ""));
            } catch (Exception e) {
                formData.reject("Erro interno de sistema");
                return badRequest(views.html.admin.monitoramento.basecalculadadia.edit.render(id, formData));
            }

        }
    }

    /*Filtra a basecalculadadia pela propriedade ano e mes - nao necessario autenticacao*/
    public Result buscarDiasPorMesPropriedades(String propriedade, Integer ano, Integer mes) {

        try {

            Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

            if (possivelPropriedadeSelecionada.isPresent()) {

                Query<BaseCalculadaDia> query = Ebean.createQuery(BaseCalculadaDia.class);

                List<BaseCalculadaDia> basesCalculadaDia = query
                        .where()
                        .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                        .eq("ano", ano)
                        .eq("mes", mes)
                        .order()
                        .asc("dia")
                        .findList();

                return ok(Json.toJson(basesCalculadaDia));
            }
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
        return notFound();
    }
}
