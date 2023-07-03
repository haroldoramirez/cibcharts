package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Model;
import com.avaje.ebean.PagedList;
import validators.monitoramento.BasePingFormData;

import javax.persistence.*;
import java.util.*;

@Entity
public class BasePing extends Model {

    private static final long serialVersionUID = 1L;

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataDoPing;

    @Column(nullable = false, length = 5)
    private String socketConnectionTest;

    @Column(nullable = false, length = 5)
    private String httpConnectionTest;

    @ManyToOne
    private Propriedade propriedade;

    /*Atributos apenas para validacao de dados incorretos*/
    @Transient
    private Integer ano;
    @Transient
    private Integer mes;
    @Transient
    private Integer dia;

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    public BasePing() {}

    public BasePing(Long id,
                    Calendar dataDoPing,
                    String socketConnectionTest,
                    String httpConnectionTest,
                    Propriedade propriedade,
                    Integer ano,
                    Integer mes,
                    Integer dia) {
        this.setId(id);
        this.setDataDoPing(dataDoPing);
        this.setSocketConnectionTest(socketConnectionTest);
        this.setHttpConnectionTest(httpConnectionTest);
        this.setPropriedade(propriedade);
        this.setAno(ano);
        this.setMes(mes);
        this.setDia(dia);
    }

    public static BasePing makeInstance(BasePingFormData formData) {
        BasePing basePing = new BasePing();
        basePing.setDataDoPing(formData.dataDoPing);
        basePing.setSocketConnectionTest(formData.socketConnectionTest);
        basePing.setHttpConnectionTest(formData.httpConnectionTest);
        basePing.setPropriedade(Propriedade.findPropriedade(formData.propriedade));
        return basePing;
    }

    public static BasePingFormData makeBasePingFormData(Long id) {

        BasePing basePing = Ebean.find(BasePing.class, id);

        if (basePing == null) {
            throw new RuntimeException("Objeto não encontrado");
        }

        return new BasePingFormData(
                basePing.dataDoPing,
                basePing.socketConnectionTest,
                basePing.httpConnectionTest,
                basePing.propriedade,
                basePing.ano,
                basePing.mes,
                basePing.dia);
    }

    /*-------------------------------------------------------------------
     *				 		    GETTERS AND SETTERS
     *-------------------------------------------------------------------*/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getDataDoPing() {
        return dataDoPing;
    }

    public void setDataDoPing(Calendar dataDoPing) {
        this.dataDoPing = dataDoPing;
    }

    public String getSocketConnectionTest() {
        return socketConnectionTest;
    }

    public void setSocketConnectionTest(String socketConnectionTest) {
        this.socketConnectionTest = socketConnectionTest;
    }

    public String getHttpConnectionTest() {
        return httpConnectionTest;
    }

    public void setHttpConnectionTest(String httpConnectionTest) {
        this.httpConnectionTest = httpConnectionTest;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    @Transient
    public Integer getAno() {
        return ano;
    }

    @Transient
    public void setAno(Integer ano) {
        this.ano = ano;
    }

    @Transient
    public Integer getMes() {
        return mes;
    }

    @Transient
    public void setMes(Integer mes) {
        this.mes = mes;
    }

    @Transient
    public Integer getDia() {
        return dia;
    }

    @Transient
    public void setDia(Integer dia) {
        this.dia = dia;
    }

    /*-------------------------------------------------------------------
     *						FINDERS
     *-------------------------------------------------------------------*/

    public static Finder<Long, BasePing> find = new Finder<>(BasePing.class);

    public static Map<String,String> options() {

        LinkedHashMap<String,String> options = new LinkedHashMap<>();

        for (BasePing b : BasePing.find.orderBy("propriedade").findList()) {
            options.put(b.id.toString(), b.propriedade.getNome());
        }

        return options;
    }

    /**
     * Return a page of object list
     *
     * @param page Page to display
     * @param pageSize Number of objects per page
     * @param sortBy object year property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static PagedList<BasePing> page(int page, int pageSize, String sortBy, String order, String filter) {
        /*Buscar uma forma de retornar o ilike com dados timestamp e não apenas string -> acontece o erro*/
        /*Query threw SQLException:ERRO: função lower(timestamp without time zone) não existe
            Dica: Nenhuma função corresponde com o nome e os tipos de argumentos informados. Você precisa adicionar conversões de tipo explícitas.
            Pode ser dados timestamp ou pela propriedade
         */
        return
                find.where()
                        .ilike("socket_connection_test", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .fetch("propriedade")
                        .findPagedList(page, pageSize);
    }

    /**
     * Return a list of last log registered
     *
     */
    public static List<BasePing> last() {
        return find.where().orderBy("dataDoPing desc").setMaxRows(8).findList();
    }

    /*-------------------------------------------------------------------
     *						UTILS
     *-------------------------------------------------------------------*/

    /**
     * Create a map of Propriedade name -> boolean where the boolean is true if the Propriedade corresponds to the BasePing.
     * @param cadastro The Propriedade with a BasePing.
     * @return A map of Propriedade to boolean indicating which one is the BasePings Propriedade.
     */
    public static Map<String, Boolean> makePropriedadeMap(BasePingFormData cadastro) {

        Map<String, Boolean> propriedadeMap = new TreeMap<>();

        for (Propriedade propriedade : Ebean.find(Propriedade.class).findList()) {
            propriedadeMap.put(propriedade.getNome(), cadastro!=null
                    && (cadastro.propriedade != null
                    && cadastro.propriedade.equals(propriedade.getNome())));
        }

        return propriedadeMap;
    }

    /**
     * Create a map of Propriedade name -> boolean where the boolean is true if the Propriedade corresponds to the BasePing.
     * @param cadastroForm The Propriedade with a BasePing.
     * @return A map of Propriedade to boolean indicating which one is the BasePings Propriedade.
     */
    public static Map<String, Boolean> makePropriedadeMapFilter(BasePingFormData cadastroForm) {

        Map<String, Boolean> propriedadeMap = new TreeMap<>();

        for (BaseTotal baseTotal : Ebean.find(BaseTotal.class).findList()) {
            propriedadeMap.put(baseTotal.getPropriedade().getNome(), cadastroForm != null
                    && (cadastroForm.propriedadesFiltro.equals("")
                    && cadastroForm.propriedadesFiltro.equals(baseTotal.getPropriedade().getNome())));
        }

        return propriedadeMap;
    }

    /**
     * Create a map of Anos -> boolean where the boolean is true if the Ano corresponds to the BaseCalculadaDia.
     * @param cadastroForm Formulario de cadastro com dados.
     * @return A map of Anos.
     */
    public static Map<Integer, Boolean> makeAnoMap(BasePingFormData cadastroForm) {

        Map<Integer, Boolean> anoMap = new TreeMap<>();

        return anoMap;
    }

    /**
     * Create a map of Meses -> boolean where the boolean is true if the Mes corresponds to the BaseCalculadaDia.
     * @param cadastroForm Formulario de cadastro com dados.
     * @return A map of Meses.
     */
    public static Map<Integer, Boolean> makeMesMap(BasePingFormData cadastroForm) {

        Map<Integer, Boolean> mesMap = new TreeMap<>();

        return mesMap;
    }

    /**
     * Create a map of Anos -> boolean where the boolean is true if the Ano corresponds to the BaseCalculadaDia.
     * @param cadastroForm Formulario de cadastro com dados.
     * @return A map of Dias.
     */
    public static Map<Integer, Boolean> makeDiaMap(BasePingFormData cadastroForm) {

        Map<Integer, Boolean> diaMap = new TreeMap<>();

        return diaMap;
    }

}
