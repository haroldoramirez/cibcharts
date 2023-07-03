package validators.monitoramento;

import models.Propriedade;
import play.data.validation.ValidationError;

import java.util.ArrayList;
import java.util.List;

public class BasePingValidatorFormData {

    /*Apenas para carregar os dados corretos do formulario*/
    public String propriedadesFiltro = "";
    public Integer ano = 0;
    public Integer mes = 0;
    public Integer dia = 0;

    /** Necessario para instanciar o form */
    public BasePingValidatorFormData() {}

    public BasePingValidatorFormData(Propriedade propriedade, Integer ano, Integer mes, Integer dia) {
        this.propriedadesFiltro = propriedade.getNome();
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
    }

    public List<ValidationError> validate() {

        List<ValidationError> errors = new ArrayList<>();

        if (propriedadesFiltro == null || propriedadesFiltro.length() == 0) {
            errors.add(new ValidationError("propriedadesFiltro", "Selecione a propriedade para filtrar"));
        }

        if (propriedadesFiltro == null || propriedadesFiltro.length() == 0) {
            errors.add(new ValidationError("propriedadesFiltro", "Selecione a propriedade para realizar o filtro"));
        }

        if (ano == null || ano == 0) {
            errors.add(new ValidationError("ano", "Selecione o ano para realizar o filtro"));
        }

        if (mes == null || mes == 0) {
            errors.add(new ValidationError("mes", "Selecione o mês para realizar o filtro"));
        }

        if (dia == null || dia == 0) {
            errors.add(new ValidationError("dia", "Selecione o dia para realizar o filtro"));
        }

        return errors.isEmpty() ? null : errors;
    }
}
