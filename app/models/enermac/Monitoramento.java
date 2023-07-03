package models.enermac;

import com.avaje.ebean.Model;

import javax.persistence.*;

@Entity
public class Monitoramento extends Model {

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Gerador gerador;

    @Column(length = 45)
    private String obs;

    /*-------------------------------------------------------------------
     *						GETTERS AND SETTERS
     *-------------------------------------------------------------------*/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Gerador getGerador() {
        return gerador;
    }

    public void setGerador(Gerador gerador) {
        this.gerador = gerador;
    }

    public String getObs() {
        return obs;
    }

    public void setObs(String obs) {
        this.obs = obs;
    }

    /*-------------------------------------------------------------------
     *						FINDERS
     *-------------------------------------------------------------------*/

    public static Finder<Long, Monitoramento> find = new Finder<>(Monitoramento.class);

}