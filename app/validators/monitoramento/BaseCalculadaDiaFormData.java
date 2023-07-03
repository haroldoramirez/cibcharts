package validators.monitoramento;

import play.data.validation.ValidationError;
import play.i18n.Messages;

import java.util.ArrayList;
import java.util.List;

public class BaseCalculadaDiaFormData {

    /*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
     *-------------------------------------------------------------------*/

    public String indicador = "";

    /*-------------------------------------------------------------------
     * 		 					CONSTRUCTORS
     *-------------------------------------------------------------------*/

    /** Necessario para instanciar o form */
    public BaseCalculadaDiaFormData() {}

    public BaseCalculadaDiaFormData(String indicador) {
        this.indicador = indicador;
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

        return errors.isEmpty() ? null : errors;
    }
}
