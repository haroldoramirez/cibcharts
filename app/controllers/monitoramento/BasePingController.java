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
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import secured.SecuredAdmin;
import validators.monitoramento.BasePingFormData;
import views.html.admin.monitoramento.baseping.list;

import javax.inject.Inject;
import java.io.BufferedReader;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.util.*;

import static play.data.Form.form;

public class BasePingController extends Controller {

    @Inject
    private PropriedadeDAO propriedadeDAO;

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
     * Retrieve a list of all objects
     *
     * @return a list of all objects in a render template
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result telaLista(int page, String sortBy, String order, String filter) {
        try {
            return ok(
                    list.render(
                            BasePing.page(page, 13, sortBy, order, filter),
                            sortBy, order, filter
                    )
            );
        } catch (Exception e) {
            Logger.error(e.getMessage());
            return badRequest(views.html.error.render(e.getMessage()));
        }
    }

    /**
     * @return a form if auth OK
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result telaNovo(Long id) {

        BasePingFormData basePingData = (id == 0) ? new BasePingFormData() : models.BasePing.makeBasePingFormData(id);

        Form<BasePingFormData> basePingForm = form(BasePingFormData.class);

        return ok(views.html.admin.monitoramento.baseping.create.render(id, basePingForm,
                BasePing.makePropriedadeMap(basePingData),
                BasePing.makeAnoMap(basePingData),
                BasePing.makeMesMap(basePingData),
                BasePing.makeDiaMap(basePingData),
                BasePing.makePropriedadeMapFilter(basePingData),
                BasePing.last(),
                null));
    }

    /**
     * Funcao inserir -> responsavel por cadastrar os pings na base de dados com suas respectivas origens.
     * A funcao separar os pings por dias meses e anos mas sem gerar indicadores
     * @return a form if auth OK
     */
    @Security.Authenticated(SecuredAdmin.class)
    public Result inserir(Long id) {

        /*String Builder para registrar os logs*/
        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb);

        /*Variaveis das datas*/
        int anoDoPing = 0;
        int anoValidador = 0;
        int mesDoPing = 0;
        int mesValidador = 0;
        int diaDoPing = 0;
        int diaValidador = 0;

        /*Contadores de pings por dia*/
        float totalPingPorDia = 0;
        float totalFalhaPorDia = 0;
        float totalPingPorDiaAux = 0;
        float totalFalhaPorDiaAux = 0;
        int contador = 0;

        /*Flag quando dias e meses novos forem detectados*/
        boolean novoDia = false;
        boolean novoMes = false;

        /*Cada linha do arquivo CSV*/
        String linha;

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
            try {

                /*
                * Eu tenho um laço while que percorre ate o final do arquivo csv, cada linha do csv te um ping com um campo datetime
                * Estou tentando verificar o datetime de cada ping e ver se o dia do ping mudou, caso ele mudar eu faço outra lógica.
                * Percorrer o timestamp ate ver que o dia mudou quando o dia mudar eu paro o codigo e inicio outro procedimento
                * */

                Http.MultipartFormData body = request().body().asMultipartFormData();
                Http.MultipartFormData.FilePart arquivo = body.getFile("arquivo");

                //cria um objeto para ler o arquivo csv
                BufferedReader bReader = new BufferedReader(new FileReader(arquivo.getFile()));

                /*Formata a data em string*/
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

                /*Para remover a primeira linha ou header*/
                bReader.readLine(); //esta linha vai ler a primeira linha onde esta o header

                Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(formData.get().propriedade);

                if (possivelPropriedadeSelecionada.isPresent()) {

                    /*buscar uma forma de ordenar o datetime de cada ping antes de realizar o calculo*/
                    /*O while fica em loop até encontrar a ultima linha*/
                    while ((linha = bReader.readLine()) != null) { // a estrutura de repeticao vai iniciar a partir da linha 2, sem o header
                        /*Estrutura While para percorrer cada ping e realizar os calculos*/

                        /*Linha de cada pings do Csv*/
                        String[] pingCsv = linha.split(",+");

                        /*Cria instancia de cada ping*/
                        BasePing basePing = new BasePing();

                        /*Seta a propriedade de cada ping para salvar no banco*/
                        basePing.setPropriedade(Propriedade.findPropriedade(formData.data().get("propriedade")));

                        /*Le o timestamp do csv*/
                        String dateString = pingCsv[0];

                        /*Necessario formatar a data para adicionar no objeto*/
                        Date dateTimestamp = dateFormatter.parse(dateString);

                        /*Instancia um Calendar*/
                        Calendar pingTimestamp = Calendar.getInstance();

                        /*Seta a date formatada no Calendar*/
                        pingTimestamp.setTime(dateTimestamp);

                        /*Não é necessario percorrer a string datetime pois o calendar me proporciona pegar os dias meses e anos separados a partir disso posso realizar verificacoes nos dias de cada ping*/
                        /*Para calcular os anos e adicionar na base calculo dia*/
                        anoDoPing = pingTimestamp.get(Calendar.YEAR);

                        /*Para calcular os meses e adicionar na base calculo dia*/
                        mesDoPing = pingTimestamp.get(Calendar.MONTH) + 1;

                        /*Para calcular os dias e adicionar na base calculo dia*/
                        diaDoPing = pingTimestamp.get(Calendar.DAY_OF_MONTH);

                        /*Seta os dados no objeto basePing*/
                        basePing.setDataDoPing(pingTimestamp);
                        basePing.setSocketConnectionTest(pingCsv[1]);
                        basePing.setHttpConnectionTest(pingCsv[2]);

                        //Salva os dados do basePing no banco
                        basePing.save();

                        /*-------------------------------------------------------------------
                         *				 		    Calculos Dia Inicio
                         *-------------------------------------------------------------------*/

                        /*
                        *
                        * Achar uma forma de validar a data do ping atual com a data futuro, assim e possivel verificar se eu continuo realizando a contagem dos pings ou salvo o objeto baseCalculada dia
                        * e depois crio um novo objeto, faco a contagem de pings e salvo o dia seguinte
                        * A data anterior com a dataDoPing nao funciona por nao conseguir pegar a proxima data dentro do laço while
                        * A cada ping percorrido verificar se o dia mudou
                        *
                        * A logica dos dias funciona mas nao salva o ultimo dia - solucao - armazenar dos ultimos dados gerados dentro do laco while e salvar o ultimo objeto fora do while
                        *
                        * */

                        /*criar if pra verificar por dia*/


                        /*-------------------------------------------------------------------
                         *				 		    Calculos Dia Inicio
                         *-------------------------------------------------------------------*/


                            /*Verificador responsavel por entrar no primeiro if*/
                        if (diaValidador == 0) {
                            diaValidador = diaDoPing;
                        }

                        /*Verificador responsavel por entrar no primeiro if*/
                        if (mesValidador == 0) {
                            mesValidador = mesDoPing;
                        }

                        /*Verificador responsavel por entrar no primeiro if*/
                        if (anoValidador == 0) {
                            anoValidador = anoDoPing;
                        }

                        /*If que amarra o ano mes e dia*/
                        if (anoValidador == anoDoPing) {
                            if (mesValidador == mesDoPing) {

                                /*Verificar se o diaValidador e igual ao dia do Ping se for incrementamos os pings e falhas*/
                                if (diaValidador == diaDoPing) {
                                    totalPingPorDia++;

                                    if (pingCsv[1].equals("FAIL") && pingCsv[2].equals("FAIL")
                                            || pingCsv[1].equals("SLOW") && pingCsv[2].equals("SLOW")
                                            || pingCsv[1].isEmpty() && pingCsv[2].isEmpty()) {

                                        totalFalhaPorDia++;
                                    }
                                } else { //else se for um  novo dia
                                    totalPingPorDiaAux = totalPingPorDia;
                                    totalFalhaPorDiaAux = totalFalhaPorDia;
                                    novoDia = true;
                                }
                            } else {
                                totalPingPorDiaAux = totalPingPorDia;
                                totalFalhaPorDiaAux = totalFalhaPorDia;
                                novoDia = true;
                                novoMes = true;
                            }
                        }

                        /*Verifica se estamos no novo dia do arquivo CSV*/
                        if (novoDia) {

                            /*Chama o metodo para salvar o dia*/
                            calcularBaseDia(possivelPropriedadeSelecionada.get(), anoValidador, mesValidador, diaValidador, totalPingPorDiaAux, totalFalhaPorDiaAux);

                            /*Eu seto valor 0 dos pings/falhas pois sera calculado no proximo dia*/
                            totalPingPorDia = 0;
                            totalFalhaPorDia = 0;
                            totalPingPorDiaAux = 0;
                            totalFalhaPorDiaAux = 0;

                            /*Atualiza o dia*/
                            diaValidador = diaDoPing;

                            /*Seta o dia para false*/
                            novoDia = false;

                            /*Continua a quantidade de contagem */
                            totalPingPorDia++;

                            /*continua incrementando os pings se for falho no novo dia*/
                            if (pingCsv[1].equals("FAIL") || pingCsv[1].isEmpty() || pingCsv[1].equals("SLOW")) {
                                totalFalhaPorDia++;
                            }
                        }

                        /*Verifica se estamos no novo mes do arquivo CSV*/
                        if (novoMes) {

                            calcularBaseTotal(possivelPropriedadeSelecionada.get(), anoValidador, mesValidador);

                            /*Atualiza o mes*/
                            mesValidador = mesDoPing;

                            /*Seta o dia para false*/
                            novoMes = false;

                        }
                        contador++;
                    }/*Fim do While*/

                    /*Chama o metodo para salvar o dia*/
                    calcularBaseDia(possivelPropriedadeSelecionada.get(), anoValidador, mesValidador, diaValidador, totalPingPorDia, totalFalhaPorDia);

                    /*Chama o metodo para salvar o Mes*/
                    calcularBaseTotal(possivelPropriedadeSelecionada.get(), anoValidador, mesValidador);

                    formatter.format("Pings novos cadastrados no sistema pelo usuário '%1s' para a propriedade '%2s'.", usuarioAtual().get().getNome(), possivelPropriedadeSelecionada.get().getNome());
                    logController.inserir(sb.toString());

                }/*Fim do If Present*/

                tipoMensagem = "success";
                mensagem = "Total de " + contador + " novos Pings adicionados na propriedade '" + possivelPropriedadeSelecionada.get().getNome() + "'";
                return created(views.html.mensagens.monitoramento.baseping.mensagens.render(mensagem,tipoMensagem));

            } catch (Exception e) {

                Logger.error(e.getMessage());
                formData.reject("Erro interno de Sistema. Descrição: " + e);

                return badRequest(views.html.admin.monitoramento.baseping.create.render(id, formData,
                        BasePing.makePropriedadeMap(basePingData),
                        BasePing.makeAnoMap(basePingData),
                        BasePing.makeMesMap(basePingData),
                        BasePing.makeDiaMap(basePingData),
                        BasePing.makePropriedadeMapFilter(basePingData),
                        BasePing.last(),
                        null));
            }
        }

    }

    @Security.Authenticated(SecuredAdmin.class)
    private void calcularBaseDia (Propriedade propriedade, int ano, int mes, int dia, float pingsPorDia, float falhasPorDia) {

        BaseCalculadaDia buscaDia = Ebean.find(BaseCalculadaDia.class)
                .where()
                .eq("propriedade_id", propriedade.getId())
                .eq("ano", ano)
                .eq("mes", mes)
                .eq("dia", dia)
                .findUnique();

        if (buscaDia == null) {

            /*Instancia da Base calculada por dia*/
            BaseCalculadaDia baseCalculadaDia = new BaseCalculadaDia();

            baseCalculadaDia.setPropriedade(Propriedade.findPropriedade(propriedade.getNome()));
            baseCalculadaDia.setAno(ano);
            baseCalculadaDia.setMes(mes);
            baseCalculadaDia.setDia(dia);
            baseCalculadaDia.setTotalFalha(String.valueOf(falhasPorDia));
            baseCalculadaDia.setTotalPing(String.valueOf(pingsPorDia));
            baseCalculadaDia.setStatus(false);
            baseCalculadaDia.setManutencao(false);

            /*O usuario decide quando gerar o indicador*/
            baseCalculadaDia.setIndicador(String.valueOf(0));
            baseCalculadaDia.setDataAlteracao(Calendar.getInstance());

            //Salva no banco de dados
            baseCalculadaDia.save();

        }

    }

    @Security.Authenticated(SecuredAdmin.class)
    private void calcularBaseTotal(Propriedade propriedade, int ano, int mes) {

        BaseTotal buscaBaseTotal = Ebean.find(BaseTotal.class)
                .where()
                .eq("propriedade_id", propriedade.getId())
                .eq("ano", ano)
                .eq("mes", mes).findUnique();

        if (buscaBaseTotal == null) {

            /*Instancia da Base Total por dia*/
            BaseTotal baseTotal = new BaseTotal();

            baseTotal.setPropriedade(Propriedade.findPropriedade(propriedade.getNome()));
            baseTotal.setAno(ano);
            baseTotal.setMes(mes);

            /*As falhas serao adicionadas quando o usuario realizar a atualizacao dos dias*/
            baseTotal.setTotalPing(String.valueOf(0));
            baseTotal.setTotalFalha(String.valueOf(0));

            /*O usuario decide a hora de calcular*/
            baseTotal.setIndicador(String.valueOf(0));
            baseTotal.setDataAlteracao(Calendar.getInstance());

            //Salva no banco de dados
            baseTotal.save();
        }
    }

    /*Funcao responsavel por filtrar os pings por dia e retornar um classe baseCalculadaDia em json*/
    public Result filtrarPings(String propriedade, Integer ano, Integer mes, Integer dia) {

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        BaseCalculadaDia baseCalculadaDia = new BaseCalculadaDia();

        float totalPingPorDia = 0;
        float totalFalhaPorDia = 0;
        float indicadorPorDia = 0;

        if (possivelPropriedadeSelecionada.isPresent()) {

            try {

                //String dateString = ano + "-"+ mes + "-" + dia;
                String stringDate = ano + "-" + mes + "-" + dia + " 00:00:00";

                String stringDate2 = ano + "-" + mes + "-" + dia + " 23:59:59";

                //*Formata a data em string*//*
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

                //*Necessario formatar a data para adicionar no objeto*//*
                Date dateTimestamp = dateFormatter.parse(stringDate);
                Date dateTimestamp2 = dateFormatter.parse(stringDate2);

                Query<BasePing> query = Ebean.createQuery(BasePing.class, "find base_ping " +
                        "where propriedade_id = :idPropriedade " +
                        "and data_do_ping BETWEEN(:data_ping) AND (:data_ping2)");

                query.setParameter("idPropriedade", possivelPropriedadeSelecionada.get().getId());
                query.setParameter("data_ping", dateTimestamp);
                query.setParameter("data_ping2", dateTimestamp2);

                List<BasePing> pingsFiltrados = query.findList();

                for (BasePing ping : pingsFiltrados) {
                    totalPingPorDia++;

                    if (ping.getHttpConnectionTest().equals("FAIL") && ping.getSocketConnectionTest().equals("FAIL")
                            || ping.getHttpConnectionTest().equals("SLOW") && ping.getSocketConnectionTest().equals("SLOW")
                            || ping.getHttpConnectionTest().equals("") && ping.getSocketConnectionTest().equals("")) {

                        totalFalhaPorDia++;
                    }

                }

                indicadorPorDia = (1-(totalFalhaPorDia/totalPingPorDia))*100;

                /*Objeto onde sera adicionado a quantidade de pings filtrados e falhas*/
                baseCalculadaDia.setPropriedade(possivelPropriedadeSelecionada.get());
                baseCalculadaDia.setStatus(true);
                baseCalculadaDia.setDataAlteracao(Calendar.getInstance());
                baseCalculadaDia.setAno(ano);
                baseCalculadaDia.setMes(mes);
                baseCalculadaDia.setDia(dia);
                baseCalculadaDia.setTotalFalha(String.valueOf(totalFalhaPorDia));
                baseCalculadaDia.setTotalPing(String.valueOf(totalPingPorDia));
                baseCalculadaDia.setIndicador(String.valueOf(indicadorPorDia));

                return ok(Json.toJson(baseCalculadaDia));

            } catch (Exception e) {
                Logger.error(e.getMessage());
                return internalServerError(Json.toJson(e.getLocalizedMessage()));
            }

        }

        return notFound();
    }

    /*Funcao responsavel por retornar os pings por mes de uma propriedade*/
    public Result buscarPingsPorMes(String propriedade, Integer ano, Integer mes) {

        Optional<Propriedade> possivelPropriedadeSelecionada = propriedadeDAO.comNome(propriedade);

        String stringDate2;

        String stringDate = ano + "-" + mes + "-" + "1";

        /*Implementar melhor quando tive todos os meses do ano - pode ser ir ou or*/
        if (mes == 2) {
            stringDate2 = ano + "-" + mes + "-" + "29";
        } else {
            stringDate2 = ano + "-" + mes + "-" + "32";
        }

        //*Formata a data em string*//*
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);

        if (possivelPropriedadeSelecionada.isPresent()) {

            try {

                //*Necessario formatar a data para adicionar no objeto*//*
                Date dateTimestamp = dateFormatter.parse(stringDate);
                Date dateTimestamp2 = dateFormatter.parse(stringDate2);

                Query<BasePing> query = Ebean.createQuery(BasePing.class, "FIND base_ping " +
                        "WHERE propriedade_id = :idPropriedade " +
                        "AND data_do_ping BETWEEN(:data_ping) AND (:data_ping2)" +
                        "ORDER BY data_do_ping ASC");

                query.setParameter("idPropriedade", possivelPropriedadeSelecionada.get().getId());
                query.setParameter("data_ping", dateTimestamp);
                query.setParameter("data_ping2", dateTimestamp2);

                List<BasePing> pingsFiltrados = query.findList();

                return ok(Json.toJson(pingsFiltrados));

            } catch (Exception e) {
                Logger.error(e.getMessage());
                return internalServerError(Json.toJson(e.getLocalizedMessage()));
            }

        }

        return notFound();

    }

}
