package validators.monitoramento;

import play.data.validation.ValidationError;
import play.i18n.Messages;

import java.util.ArrayList;
import java.util.List;

public class BaseTotalFormData {

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    public String indicador = "";
    public String totalPing = "";
    public String totalFalha = "";

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    /** Necessario para instanciar o form */
    public BaseTotalFormData() {}

    public BaseTotalFormData(String indicador, String totalPing, String totalFalha) {
        this.indicador = indicador;
        this.totalPing = totalPing;
        this.totalFalha = totalFalha;
    }

    /*-------------------------------------------------------------------
     *						BEHAVIORS
     *-------------------------------------------------------------------*/

    /*Verificador de Campos do Form*/
    public List<ValidationError> validate() {

        List<ValidationError> errors = new ArrayList<>();

        if (indicador == null || indicador.length() == 0) {
            errors.add(new ValidationError("indicador", Messages.get("field.name")));
        } else if (indicador.length() > 80) {
            errors.add(new ValidationError("indicador", Messages.get("field.length.max")));
        }

        if (totalPing == null || totalPing.length() == 0) {
            errors.add(new ValidationError("totalPing", Messages.get("field.name")));
        } else if (totalPing.length() > 100000) {
            errors.add(new ValidationError("totalPing", Messages.get("field.length.max")));
        }

        if (totalFalha == null || totalFalha.length() == 0) {
            errors.add(new ValidationError("totalFalha", Messages.get("field.name")));
        } else if (totalFalha.length() > 100000) {
            errors.add(new ValidationError("totalFalha", Messages.get("field.length.max")));
        }

        return errors.isEmpty() ? null : errors;
    }
}
