package models.enermac;

import com.avaje.ebean.Model;
import models.enermac.Cidade;

import javax.persistence.*;

@Entity
public class Localidade extends Model {

    private static final long serialVersionUID = 1L;

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 200, unique = true)
    private String nome;

    @ManyToOne
    private Cidade cidade;

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

    public Cidade getCidade() {
        return cidade;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }
}
