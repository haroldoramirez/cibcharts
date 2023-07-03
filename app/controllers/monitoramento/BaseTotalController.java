package controllers.monitoramento;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import controllers.LogController;
import daos.UsuarioDAO;
import daos.monitoramento.PropriedadeDAO;
import models.BaseTotal;
import models.EnvelopeDeIndicador;
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
import validators.monitoramento.BaseTotalFormData;
import views.html.admin.monitoramento.basetotal.list;

import javax.inject.Inject;
import java.util.*;

import static play.data.Form.form;

public class BaseTotalController extends Controller {

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
                            BaseTotal.page(page, 13, sortBy, order, filter),
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
            BaseTotalFormData formDataTotal = (id == 0) ? new BaseTotalFormData() : models.BaseTotal.makeBaseTotalFormData(id);

            //apos o objeto ser instanciado passamos os dados para o eventoformdata e os dados serao carregados no form edit
            Form<BaseTotalFormData> formData = form(BaseTotalFormData.class).fill(formDataTotal);

            return ok(views.html.admin.monitoramento.basetotal.edit.render(id,formData));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /*Editar objeto atraves do seu ID*/
    @Security.Authenticated(SecuredAdmin.class)
    public Result editar(Long id) {
        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Resgata os dados do formulario atraves de uma requisicao
        Form<BaseTotalFormData> formData = form(BaseTotalFormData.class).bindFromRequest();

        //verificar se tem erros no formData, caso tiver erros retorna o formulario com os erros caso não tiver, continua o processo de alteracao do objeto
        if (formData.hasErrors()) {
            return badRequest(views.html.admin.monitoramento.basetotal.edit.render(id,formData));
        } else {
            try {
                BaseTotal buscaObj = Ebean.find(BaseTotal.class, id);

                if (buscaObj == null) {
                    return notFound(views.html.mensagens.erro.naoEncontrado.render("não encontrado"));
                }

                //Converte os dados do formulario para uma instancia do objeto
                BaseTotal baseTotal = BaseTotal.makeInstance(formData.get());

                baseTotal.setId(id);
                baseTotal.setDataAlteracao(Calendar.getInstance());
                baseTotal.update();

                /*Se existir um usuario presente, registre o log no sistema*/
                if (usuarioAtual().isPresent()) {
                    formatter.format("Usuário: '%1s' atualizou um registro: '%2s'.", usuarioAtual().get().getEmail(), baseTotal.getPropriedade().getNome());
                    logController.inserir(sb.toString());
                }

                flash("info", "Indicador do Mês '" + baseTotal.getMes() + "' da Propriedade " + baseTotal.getPropriedade().getNome() + " foi atualizada.");
                return redirect(controllers.monitoramento.routes.BaseTotalController.telaLista(0, "indicador", "asc", ""));
            } catch (Exception e) {
                formData.reject("Erro interno de sistema");
                return badRequest(views.html.admin.monitoramento.basetotal.edit.render(id, formData));
            }

        }
    }

    /**
     * Retrieve a list of all objects
     *
     * @return a list of all objects in a json
     */
    public Result buscaPorAnoMes(Integer ano, Integer mes) {

        try {

            Query<BaseTotal> query = Ebean.createQuery(BaseTotal.class);

            List<BaseTotal> baseTotal = query
                    .where()
                    .eq("ano", ano).eq("mes", mes)
                    .findList();

            return ok(Json.toJson(baseTotal));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }

    }

    /*Funcao responsavel por calcular o indicador de cada ano para cada propriedade
    * Verificar porque as vezes esta funcionalidade chega com valor 0 apos carregamento de paginas
    * ROUTE - GET     /basetotal/indicador/:ano
    * Erro aleatório
    * TODO
    * */
    public Result indicadorAno(Integer ano) {

        float pings = 0;
        float falhas = 0;
        float indicadorAno;

        try {

            Query<BaseTotal> query = Ebean.createQuery(BaseTotal.class);

            /*Busca basesTotais com o mesmo ano e cria uma lista*/
            List<BaseTotal> baseTotal = query
                    .where()
                    .eq("ano", ano)
                    .findList();

            /*Percorre a lista de basesTotais encontradas no banco*/
            for (BaseTotal base : baseTotal) {
                pings = Float.valueOf(base.getTotalPing()) + pings;
                falhas = Float.valueOf(base.getTotalFalha()) + falhas;
            }

            /*Faz o calculo do indicador por ano*/
            if(falhas == 0 || pings == 0) {
                indicadorAno = 0;
            } else {
                indicadorAno = (1-(falhas/pings))*100;
            }

            EnvelopeDeIndicador envelopeDeIndicador = new EnvelopeDeIndicador(indicadorAno);

            return ok(Json.toJson(envelopeDeIndicador));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }


    }

    /*Funcao responsavel por retornar a basetotal por ano
    *
    *ROUTE - GET     /basetotal/propriedade/:propriedade/:ano
    * */
    public Result buscarMesesPropriedades(String propriedade, Integer ano) {

        try {

            Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

            if (possivelPropriedadeSelecionada.isPresent()) {
                Query<BaseTotal> query = Ebean.createQuery(BaseTotal.class);

                List<BaseTotal> basesTotais = query
                        .where()
                        .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                        .eq("ano", ano)
                        .order()
                        .asc("mes")
                        .findList();

                return ok(Json.toJson(basesTotais));
            }
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }

        return notFound();
    }

    /**
     * Funcao responsavel por retornar os anos Referencias cadastradas no GestaoCentro
     * ROUTE - GET     /indicadoranual/anos/todos
     * @return Result Json
     */
    public Result listaAnos() {
        try {

            LinkedHashSet<Integer> listaAnos = new LinkedHashSet<>();

            Query<BaseTotal> query = Ebean.createQuery(BaseTotal.class);

            List<BaseTotal> basesTotais = query
                    .where()
                    .order().desc("ano")
                    .findList();

            for (BaseTotal baseTotal : basesTotais) {

                listaAnos.add(baseTotal.getAno());

            }

            return ok(Json.toJson(listaAnos));

        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(Json.toJson(Messages.get("app.error")));
        }
    }
}
