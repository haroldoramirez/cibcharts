package controllers.monitoramento;

import com.avaje.ebean.Ebean;
import controllers.LogController;
import daos.UsuarioDAO;
import models.Propriedade;
import models.Usuario;
import play.Logger;
import play.data.Form;
import play.data.validation.ValidationError;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import secured.SecuredAdmin;
import validators.monitoramento.PropriedadeFormData;
import views.html.admin.monitoramento.propriedades.list;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.Calendar;
import java.util.Formatter;
import java.util.Optional;

import static play.data.Form.form;

@Security.Authenticated(SecuredAdmin.class)
public class PropriedadeController extends Controller {

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

    /**
     * @return autenticado form if auth OK or not authorized
     */
    public Result telaNovo() {
        Form<PropriedadeFormData> propriedadeForm = form(PropriedadeFormData.class);

        return ok(views.html.admin.monitoramento.propriedades.create.render(propriedadeForm));
    }

    /**
     * Retrieve a list of all objects
     *
     * @return a list of all objects in a render template
     */
    public Result telaLista(int page, String sortBy, String order, String filter) {
        try {
            return ok(
                    list.render(
                            Propriedade.page(page, 13, sortBy, order, filter),
                            sortBy, order, filter
                    )
            );
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * @return render a detail form with a data
     */
    public Result telaDetalhe(Long id) {
        try {
            Propriedade propriedade = Ebean.find(Propriedade.class, id);

            if (propriedade == null) {
                return notFound(views.html.mensagens.erro.naoEncontrado.render("Não encontrado"));
            }

            return ok(views.html.admin.monitoramento.propriedades.detail.render(propriedade));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * @return render edit form with a data
     */
    public Result telaEditar(Long id) {

        try {
            //logica onde instanciamos um objeto evento que esteja cadastrado na base de dados
            PropriedadeFormData propriedadeFormData = (id == 0) ? new PropriedadeFormData() : models.Propriedade.makePropriedadeFormData(id);

            //apos o objeto ser instanciado passamos os dados para o eventoformdata e os dados serao carregados no form edit
            Form<PropriedadeFormData> formData = form(PropriedadeFormData.class).fill(propriedadeFormData);

            return ok(views.html.admin.monitoramento.propriedades.edit.render(id,formData));
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * Save
     *
     * @return a render view to inform OK
     */
    public Result inserir() {

        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Resgata os dados do formulario atraves de uma requisicao e realiza a validacao dos campos
        Form<PropriedadeFormData> formData = form(PropriedadeFormData.class).bindFromRequest();

        //se existir erros nos campos do formulario retorne o propriedadeFormData com os erros
        if (formData.hasErrors()) {
            return badRequest(views.html.admin.monitoramento.propriedades.create.render(formData));
        } else {
            try {
                //Converte os dados do formularios para uma instancia do propriedade
                Propriedade propriedade = Propriedade.makeInstance(formData.get());

                //faz uma busca na base de dados do propriedade
                Propriedade propriedadeBusca = Ebean.find(Propriedade.class).where().eq("nome", formData.data().get("nome")).findUnique();

                if (propriedadeBusca != null) {
                    formData.reject(new ValidationError("nome", "A propriedade com nome '" + propriedadeBusca.getNome() + "' já esta Cadastrado!"));
                    return badRequest(views.html.admin.monitoramento.propriedades.create.render(formData));
                }

                propriedade.setDataCadastro(Calendar.getInstance());
                propriedade.save();

                if (usuarioAtual().isPresent()) {
                    formatter.format("Usuário: '%1s' cadastrou uma novo registro: '%2s'.", usuarioAtual().get().getEmail(), propriedade.getNome());
                    logController.inserir(sb.toString());
                }

                tipoMensagem = "success";
                mensagem = "propriedade '" + propriedade.getNome() + "' cadastrado com sucesso.";
                return created(views.html.mensagens.monitoramento.propriedade.mensagens.render(mensagem,tipoMensagem));
            } catch (Exception e) {
                Logger.error(e.getMessage());
                formData.reject("Erro interno de Sistema. Descrição: " + e);
                return badRequest(views.html.admin.monitoramento.propriedades.create.render(formData));

            }

        }
    }

    /**
     * Update a object from id
     *
     * @param id identificador
     * @return a object updated with a form
     */
    public Result editar(Long id) {

        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Resgata os dados do formulario atraves de uma requisicao e realiza a validacao dos campos
        Form<PropriedadeFormData> formData = form(PropriedadeFormData.class).bindFromRequest();

        //verificar se tem erros no formData, caso tiver erros retorna o formulario com os erros caso não tiver continua o processo de alteracao do propriedade
        if (formData.hasErrors()) {
            return badRequest(views.html.admin.monitoramento.propriedades.edit.render(id,formData));
        } else {
            try {
                Propriedade propriedadeBusca = Ebean.find(Propriedade.class, id);

                if (propriedadeBusca == null) {
                    return notFound(views.html.mensagens.erro.naoEncontrado.render("não encontrado"));
                }

                //Converte os dados do formulario para uma instancia do propriedade
                Propriedade propriedade = Propriedade.makeInstance(formData.get());

                propriedade.setId(id);
                propriedade.setDataAlteracao(Calendar.getInstance());
                propriedade.update();

                if (usuarioAtual().isPresent()) {
                    formatter.format("Usuário: '%1s' atualizou um registro: '%2s'.", usuarioAtual().get().getEmail(), propriedade.getNome());
                    logController.inserir(sb.toString());
                }

                tipoMensagem = "info";
                mensagem = "propriedade '" + propriedade.getNome() + "' atualizado com sucesso.";
                return ok(views.html.mensagens.monitoramento.propriedade.mensagens.render(mensagem,tipoMensagem));
            } catch (Exception e) {
                formData.reject("Erro interno de sistema");
                return badRequest(views.html.admin.monitoramento.propriedades.edit.render(id, formData));
            }

        }
    }

    /**
     * Remove a objeto from a id
     *
     * @param id identificador
     * @return ok object removed
     */
    public Result remover(Long id) {

        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Necessario para verificar se o usuario e gerente
        if(usuarioAtual().isPresent()){
            Usuario usuario = usuarioAtual().get();
            if (usuario.isGerente()) {
                return forbidden(views.html.mensagens.erro.naoAutorizado.render());
            }
        }

        try {
            //busca o propriedade para ser excluido
            Propriedade propriedade = Ebean.find(Propriedade.class, id);

            if (propriedade == null) {
                return notFound(views.html.mensagens.erro.naoEncontrado.render("Não encontrado"));
            }

            Ebean.delete(propriedade);

            if (usuarioAtual().isPresent()) {
                formatter.format("Usuário: '%1s' excluiu uma informação: '%2s'.", usuarioAtual().get().getEmail(), propriedade.getNome());
                logController.inserir(sb.toString());
            }

            tipoMensagem = "danger";
            mensagem = "Propriedade '" + propriedade.getNome() + "' excluído com sucesso.";
            return ok(views.html.mensagens.monitoramento.propriedade.mensagens.render(mensagem,tipoMensagem));
        } catch (PersistenceException pe) {
            tipoMensagem = "danger";
            mensagem = "Não foi possível remover a informação selecionada. Descrição do erro: Existem dados que dependem desta propriedade, remova-os primeiro.";
            Logger.error(pe.toString());
            return badRequest(views.html.mensagens.monitoramento.propriedade.mensagens.render(mensagem,tipoMensagem));
        } catch (Exception e) {
            tipoMensagem = "danger";
            mensagem = "Erro interno de Sistema. Descrição: " + e.getLocalizedMessage();
            Logger.error(e.toString());
            return badRequest(views.html.mensagens.monitoramento.propriedade.mensagens.render(mensagem,tipoMensagem));
        }
    }

}
