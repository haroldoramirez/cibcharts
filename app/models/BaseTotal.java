package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Model;
import com.avaje.ebean.PagedList;
import validators.monitoramento.BaseTotalFormData;

import javax.persistence.*;
import java.util.Calendar;

@Entity
public class BaseTotal extends Model {

    private static final long serialVersionUID = 1L;

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private String totalPing;

    @Column(nullable = false)
    private String totalFalha;

    @Column(nullable = false)
    private String indicador;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataAlteracao;

    @ManyToOne
    private Propriedade propriedade;

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    public BaseTotal() {};

    public BaseTotal(Long id,
                     Integer ano,
                     Integer mes,
                     String totalPing,
                     String totalFalha,
                     String indicador,
                     Propriedade propriedade) {

        this.setId(id);
        this.setAno(ano);
        this.setMes(mes);
        this.setTotalPing(totalPing);
        this.setTotalFalha(totalFalha);
        this.setIndicador(indicador);
        this.setPropriedade(propriedade);

    }

    /*Instancia de um objeto atraves dos dados do formData*/
    public static BaseTotal makeInstance(BaseTotalFormData formData) {


        BaseTotal baseTotal = new BaseTotal();

        baseTotal.setIndicador(formData.indicador);
        baseTotal.setTotalPing(formData.totalPing);
        baseTotal.setTotalFalha(formData.totalFalha);

        return baseTotal;
    }

    /*Instancia  de um formulario preenchido atraves do id*/
    public static BaseTotalFormData makeBaseTotalFormData(Long id) {

        BaseTotal baseTotal = Ebean.find(BaseTotal.class, id);

        if (baseTotal == null) {
            throw new RuntimeException("Objeto não encontrado");
        }

        return new BaseTotalFormData(baseTotal.indicador, baseTotal.totalPing, baseTotal.totalFalha);
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

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public String getTotalPing() {
        return totalPing;
    }

    public void setTotalPing(String totalPing) {
        this.totalPing = totalPing;
    }

    public String getTotalFalha() {
        return totalFalha;
    }

    public void setTotalFalha(String totalFalha) {
        this.totalFalha = totalFalha;
    }

    public String getIndicador() {
        return indicador;
    }

    public void setIndicador(String indicador) {
        this.indicador = indicador;
    }

    public Calendar getDataAlteracao() {
        return dataAlteracao;
    }

    public void setDataAlteracao(Calendar dataAlteracao) {
        this.dataAlteracao = dataAlteracao;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    /*-------------------------------------------------------------------
     *						FINDERS
     *-------------------------------------------------------------------*/

    public static Finder<Long, BaseTotal> find = new Finder<>(BaseTotal.class);

    /**
     * Return a page of object list
     *
     * @param page Page to display
     * @param pageSize Number of objects per page
     * @param sortBy object year property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static PagedList<BaseTotal> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                find.where()
                        .ilike("indicador", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .fetch("propriedade")
                        .findPagedList(page, pageSize);
    }

}
