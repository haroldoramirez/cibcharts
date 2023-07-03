package models.enermac;

import com.avaje.ebean.Model;

import javax.persistence.*;
import java.util.Calendar;

@Entity
public class Estatistica extends Model {

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Monitoramento monitoramento;

    @ManyToOne
    private Parametros parametros;

    @Column(nullable = false)
    private Float media;

    @Column(nullable = false)
    private Float mediana;

    @Column(nullable = false)
    private Float maximo;

    @Column(nullable = false)
    private Float minimo;

    @Column(nullable = false)
    private Float desvioPadrao;

    @Column(nullable = false)
    private Float assimetria;

    @Column(nullable = false)
    private Float moda;

    @Column(nullable = false)
    private Float amplitude;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dataRegistro;

    /*-------------------------------------------------------------------
     *						GETTERS AND SETTERS
     *-------------------------------------------------------------------*/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Monitoramento getMonitoramento() {
        return monitoramento;
    }

    public void setMonitoramento(Monitoramento monitoramento) {
        this.monitoramento = monitoramento;
    }

    public Parametros getParametros() {
        return parametros;
    }

    public void setParametros(Parametros parametros) {
        this.parametros = parametros;
    }

    public Calendar getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(Calendar dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public Float getMedia() {
        return media;
    }

    public void setMedia(Float media) {
        this.media = media;
    }

    public Float getMediana() {
        return mediana;
    }

    public void setMediana(Float mediana) {
        this.mediana = mediana;
    }

    public Float getMaximo() {
        return maximo;
    }

    public void setMaximo(Float maximo) {
        this.maximo = maximo;
    }

    public Float getDesvioPadrao() {
        return desvioPadrao;
    }

    public void setDesvioPadrao(Float desvioPadrao) {
        this.desvioPadrao = desvioPadrao;
    }

    public Float getAssimetria() {
        return assimetria;
    }

    public void setAssimetria(Float assimetria) {
        this.assimetria = assimetria;
    }

    public Float getModa() {
        return moda;
    }

    public void setModa(Float moda) {
        this.moda = moda;
    }

    public Float getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(Float amplitude) {
        this.amplitude = amplitude;
    }

    public Float getMinimo() {
        return minimo;
    }

    public void setMinimo(Float minimo) {
        this.minimo = minimo;
    }
}
