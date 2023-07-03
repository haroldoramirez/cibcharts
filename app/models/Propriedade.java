package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Model;
import com.avaje.ebean.PagedList;
import validators.monitoramento.PropriedadeFormData;

import javax.persistence.*;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity
public class Propriedade extends Model {

    private static final long serialVersionUID = 1L;

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 200, unique = true)
    private String nome;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataCadastro;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataAlteracao;

    //muitas propriedades para um usuario
/*    @ManyToOne
    @Column(nullable = false)
    private Usuario dono;*/

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    public Propriedade() {}

    public Propriedade(Long id, String nome) {
        this.setId(id);
        this.setNome(nome);
    }

    public static Propriedade makeInstance(PropriedadeFormData formData) {
        Propriedade propriedade = new Propriedade();
        propriedade.setNome(formData.nome);
        return propriedade;
    }

    public static PropriedadeFormData makePropriedadeFormData(Long id) {

        Propriedade propriedade = Ebean.find(Propriedade.class, id);

        if (propriedade == null) {
            throw new RuntimeException("Objeto não encontrado");
        }

        return new PropriedadeFormData(propriedade.nome);
    }

    /*-------------------------------------------------------------------
     *						GETTERS AND SETTERS
     *-------------------------------------------------------------------*/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Calendar getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Calendar dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Calendar getDataAlteracao() {
        return dataAlteracao;
    }

    public void setDataAlteracao(Calendar dataAlteracao) {
        this.dataAlteracao = dataAlteracao;
    }

/*    public Usuario getDono() {
        return dono;
    }

    public void setDono(Usuario dono) {
        this.dono = dono;
    }*/

    /*-------------------------------------------------------------------
     *						FINDERS
     *-------------------------------------------------------------------*/

    /**
     * Return the Propriedade instance in the database with name 'nome' or null if not found.
     * @param nome The Nome.
     * @return The Propriedade instance, or null if not found.
     */
    public static Propriedade findPropriedade(String nome) {
        for (Propriedade propriedade : Ebean.find(Propriedade.class).findList()) {
            if (nome.equals(propriedade.getNome())) {
                return propriedade;
            }
        }
        return null;
    }

    public static Finder<Long, Propriedade> find = new Finder<>(Propriedade.class);

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<>();
        for (Propriedade p : Propriedade.find.orderBy("nome").findList()) {
            options.put(p.id.toString(),p.nome);
        }
        return options;
    }

    /**
     * Return a page of Propriedade
     *
     * @param page Page to display
     * @param pageSize Number of propriedade per page
     * @param sortBy name property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static PagedList<Propriedade> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                find.where()
                        .ilike("nome", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagedList(page, pageSize);
    }

}
