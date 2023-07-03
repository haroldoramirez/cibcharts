package controllers.monitoramento;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import controllers.LogController;
import daos.UsuarioDAO;
import daos.monitoramento.PropriedadeDAO;
import models.*;
import play.Logger;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import secured.SecuredAdmin;
import validators.monitoramento.BasePingFormData;

import javax.inject.Inject;
import java.text.SimpleDateFormat;
import java.util.*;

@Security.Authenticated(SecuredAdmin.class)
public class CalculoController extends Controller {

    static private LogController logController = new LogController();

    @Inject
    private PropriedadeDAO propriedadeDAO;

    @Inject
    private UsuarioDAO usuarioDAO;

    private Optional<Usuario> usuarioAtual() {
        String email = session().get("email");
        Optional<Usuario> possivelUsuario = usuarioDAO.comEmail(email);
        return possivelUsuario;
    }

    public Result atualizarDia(Long id) {

        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        //Necessario para verificar se o usuario e gerente
        if(usuarioAtual().isPresent()){
            Usuario usuario = usuarioAtual().get();
            if (usuario.isGerente()) {
                return forbidden(views.html.mensagens.erro.naoAutorizado.render());
            }
        }

        float indicadorPorDia;
        float indicadorPorMes;
        float totalPingsPorDia = 0;
        float totalPingsPorMes;
        float totalFalhasPorDia = 0;
        float totalFalhasPorMes;
        float periodicidadePingsDia = 290;
        float falhas;

        BasePingFormData basePingData = (id == 0) ? new BasePingFormData() : models.BasePing.makeBasePingFormData(id);

        //Resgata os dados do formulario atraves de uma requisicao e realiza a validacao dos campos
        Form<BasePingFormData> formData = Form.form(BasePingFormData.class).bindFromRequest();

        //se existir erros nos campos do formulario retorne o FormData com os erros
        if (formData.hasErrors()) {
            return badRequest(views.html.admin.monitoramento.baseping.create.render(id, formData,
                    BasePing.makePropriedadeMap(basePingData),
                    BasePing.makeAnoMap(basePingData),
                    BasePing.makeMesMap(basePingData),
                    BasePing.makeDiaMap(basePingData),
                    BasePing.makePropriedadeMapFilter(basePingData),
                    BasePing.last(),
                    null));
        } else {

            Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(formData.get().propriedadesFiltro);

            if (possivelPropriedadeSelecionada.isPresent()) {

                try {

                    /*Busca a base calculada do dia salva no banco*/
                    BaseCalculadaDia baseCalculadaDia = Ebean.find(BaseCalculadaDia.class)
                            .where()
                            .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                            .eq("ano", formData.get().ano)
                            .eq("mes", formData.get().mes)
                            .eq("dia", formData.get().dia)
                            .findUnique();

                    //String dateString = ano + "-"+ mes + "-" + dia;
                    String stringDate = formData.get().ano.toString() + "-" + formData.get().mes.toString() + "-" + formData.get().dia.toString() + " 00:00:00";

                    String stringDate2 = formData.get().ano.toString() + "-" + formData.get().mes.toString() + "-" + formData.get().dia.toString() + " 23:59:59";

                    //*Formata a data em string*//*
                    SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

                    //*Necessario formatar a data para adicionar no objeto*//*
                    Date dateTimestamp = dateFormatter.parse(stringDate);

                    Date dateTimestamp2 = dateFormatter.parse(stringDate2);

                    /*Query para verificar todos os pings contabilizados do dia*/
                    Query<BasePing> query = Ebean.createQuery(BasePing.class, "find base_ping " +
                            "where propriedade_id = :idPropriedade " +
                            "and data_do_ping BETWEEN(:data_ping) AND (:data_ping2)");

                    query.setParameter("idPropriedade", possivelPropriedadeSelecionada.get().getId());
                    query.setParameter("data_ping", dateTimestamp);
                    query.setParameter("data_ping2", dateTimestamp2);

                    List<BasePing> pingsFiltrados = query.findList();

                    for (BasePing ping : pingsFiltrados) {
                        totalPingsPorDia++;

                        if (ping.getHttpConnectionTest().equals("FAIL") && ping.getSocketConnectionTest().equals("FAIL")
                                || ping.getHttpConnectionTest().equals("SLOW") && ping.getSocketConnectionTest().equals("SLOW")
                                || ping.getHttpConnectionTest().equals("") && ping.getSocketConnectionTest().equals("")) {

                            totalFalhasPorDia++;
                        }

                    }

                    /*Levando em consideracao que cada dia tem 288 pings de 5 minutos vamos adicionar o 288 de pings fixo para refinar o calculo do gráfico*/
                    /*Uma forma de melhorar a parte da periodicidade e criar no banco de dados e atrelar esse atributo a classe Propriedade*/

                    /*Verifica se a quantidade de pings é meio que a periodicidade caso seja a quantidade de pings recebe a periodicidade*/
                    if (totalPingsPorDia > periodicidadePingsDia) {
                        totalFalhasPorDia = periodicidadePingsDia;
                    }

                    /*Realiza os calculos dos indicadores*/
                    falhas = periodicidadePingsDia - totalPingsPorDia + totalFalhasPorDia;
                    indicadorPorDia = (1 - (falhas / periodicidadePingsDia)) * 100;

                    if (baseCalculadaDia != null) {

                        baseCalculadaDia.setTotalPing(String.valueOf(totalPingsPorDia));
                        baseCalculadaDia.setTotalFalha(String.valueOf(falhas));

                        baseCalculadaDia.setIndicador(String.valueOf(indicadorPorDia));
                        baseCalculadaDia.setStatus(true);
                        baseCalculadaDia.setDataAlteracao(Calendar.getInstance());

                        /*Atualiza o Dia*/
                        baseCalculadaDia.update();
                    }

                    /*O proximo passo depois de alterar o dia com o indicador novo,
                    devemos atualizar os dados no BaseTotal onde os dados sao acumulados de todos os pings e
                    falhas do mes e apos acumulado realizamos o calculo indicador do mes*/

                    BaseTotal baseTotal = Ebean.find(BaseTotal.class).where()
                            .eq("propriedade_id", possivelPropriedadeSelecionada.get().getId())
                            .eq("ano", formData.get().ano)
                            .eq("mes", formData.get().mes).findUnique();

                    if (baseTotal != null) {

                        /*Verificar uma forma onde apenas calcular a diferenca do dia e adicionar na base total*/

                        //*Pega o valor existente na base total e soma com o valor calculado do dia*//*
                        totalPingsPorMes = totalPingsPorDia + Float.valueOf(baseTotal.getTotalPing());
                        totalFalhasPorMes = falhas + Float.valueOf(baseTotal.getTotalFalha());

                        baseTotal.setTotalPing(String.valueOf(totalPingsPorMes));
                        baseTotal.setTotalFalha(String.valueOf(totalFalhasPorMes));

                        /*Calcula o indicador do Mes*/
                        indicadorPorMes = (1-(totalFalhasPorMes/totalPingsPorMes))*100;

                        baseTotal.setIndicador(String.valueOf(indicadorPorMes));
                        baseTotal.setDataAlteracao(Calendar.getInstance());

                        /*Atualiza Base Total*/
                        baseTotal.update();
                    }

                    formatter.format("Cálculo realizado com sucesso pelo usuário '%1s', da propriedade '%2s'.", usuarioAtual().get().getNome(), possivelPropriedadeSelecionada.get().getNome());
                    logController.inserir(sb.toString());

                    flash("success", "Cálculo realizado com sucesso - Data " + baseCalculadaDia.getDia() +"/"+ baseCalculadaDia.getMes() +"/"+ baseCalculadaDia.getAno() + " da Propriedade - " + baseCalculadaDia.getPropriedade().getNome());

                } catch (Exception e) {
                    Logger.error(e.getMessage());
                    return internalServerError(Json.toJson(e.getLocalizedMessage()));
                }

            }
        }

        /*Retorna a pagina carregada com o flash avisando que foi realizado o calculo do dia*/
        return redirect(controllers.monitoramento.routes.BasePingController.telaNovo(id));
    }
}
