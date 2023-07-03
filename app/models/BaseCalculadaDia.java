package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Model;
import com.avaje.ebean.PagedList;
import validators.monitoramento.BaseCalculadaDiaFormData;

import javax.persistence.*;
import java.util.Calendar;
import java.util.List;

@Entity
public class BaseCalculadaDia extends Model {

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
    private Integer dia;

    @Column(nullable = false)
    private String totalPing;

    @Column(nullable = false)
    private String totalFalha;

    @Column(nullable = false)
    private String indicador;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataAlteracao;

    @ManyToOne
    private Propriedade propriedade;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private Boolean manutencao;

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    public BaseCalculadaDia() {};

    public BaseCalculadaDia(Long id,
                     Integer ano,
                     Integer mes,
                     Integer dia,
                     String totalPing,
                     String totalFalha,
                     String indicador,
                     Propriedade propriedade,
                     Boolean status,
                     Boolean manutencao) {

        this.setId(id);
        this.setAno(ano);
        this.setMes(mes);
        this.setDia(dia);
        this.setTotalPing(totalPing);
        this.setTotalFalha(totalFalha);
        this.setIndicador(indicador);
        this.setPropriedade(propriedade);
        this.setStatus(status);
        this.setManutencao(manutencao);

    }

    /*Instancia de um objeto atraves dos dados do formData*/
    public static BaseCalculadaDia makeInstance(BaseCalculadaDiaFormData formData) {

        BaseCalculadaDia baseCalculadaDia = new BaseCalculadaDia();

        baseCalculadaDia.setIndicador(formData.indicador);

        return baseCalculadaDia;
    }

    /*Instancia  de um formulario preenchido atraves do id*/
    public static BaseCalculadaDiaFormData makeBaseCalculadaDiaFormData(Long id) {

        BaseCalculadaDia baseCalculadaDia = Ebean.find(BaseCalculadaDia.class, id);

        if (baseCalculadaDia == null) {
            throw new RuntimeException("Objeto não encontrado");
        }

        return new BaseCalculadaDiaFormData(baseCalculadaDia.indicador);
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

    public Integer getDia() {
        return dia;
    }

    public void setDia(Integer dia) {
        this.dia = dia;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public boolean isCalculado() {
        return status;
    }

    public Boolean getManutencao() {
        return manutencao;
    }

    public void setManutencao(Boolean manutencao) {
        this.manutencao = manutencao;
    }

    public boolean isManutencao() {
        return manutencao;
    }

    /*-------------------------------------------------------------------
     *						FINDERS
     *-------------------------------------------------------------------*/

    public static Finder<Long, BaseCalculadaDia> find = new Finder<>(BaseCalculadaDia.class);

    /**
     * Return a page of object list
     *
     * @param page Page to display
     * @param pageSize Number of objects per page
     * @param sortBy object year property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static PagedList<BaseCalculadaDia> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                find.where()
                        .ilike("indicador", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .fetch("propriedade")
                        .findPagedList(page, pageSize);
    }

    /**
     * Return a list of last data registered
     *
     */
    public static List<BaseCalculadaDia> last() {
        return find.where().orderBy("dataAlteracao desc").setMaxRows(8).findList();
    }

}
