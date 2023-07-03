package validators.monitoramento;

import models.Propriedade;
import play.data.validation.ValidationError;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class BasePingFormData {

    public Calendar dataDoPing = null;
    public String socketConnectionTest = "";
    public String httpConnectionTest = "";
    public String propriedade = "";

    /*Apenas para carregar os dados corretos do formulario*/
    public String propriedadesFiltro = "";
    public Integer ano = 0;
    public Integer mes = 0;
    public Integer dia = 0;

    /** Necessario para instanciar o form */
    public BasePingFormData() {}

    public BasePingFormData(Calendar dataDoPing,
                            String socketConnectionTest,
                            String httpConnectionTest,
                            Propriedade propriedade, Integer ano, Integer mes, Integer dia) {
        this.dataDoPing = dataDoPing;
        this.socketConnectionTest = socketConnectionTest;
        this.httpConnectionTest = httpConnectionTest;
        this.propriedade = propriedade.getNome();
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
    }

    public List<ValidationError> validate() {

        List<ValidationError> errors = new ArrayList<>();

/*        if (propriedade == null || propriedade.length() == 0) {
            errors.add(new ValidationError("propriedade", "Selecione a propriedade"));
        }*/

        return errors.isEmpty() ? null : errors;
    }

}
