package models.enermac;

import com.avaje.ebean.Model;

import javax.persistence.*;

@Entity
public class Gerador extends Model {

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 45)
    private String nome;

    @Column(length = 150)
    private String descricao;

    @ManyToOne
    private ModeloGerador modeloGerador;

    @ManyToOne
    private models.enermac.Propriedade propriedade;

    @Column
    private Integer ano;

    @Column(length = 45)
    private String potencia;

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public ModeloGerador getModeloGerador() {
        return modeloGerador;
    }

    public void setModeloGerador(ModeloGerador modeloGerador) {
        this.modeloGerador = modeloGerador;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getPotencia() {
        return potencia;
    }

    public void setPotencia(String potencia) {
        this.potencia = potencia;
    }
}
