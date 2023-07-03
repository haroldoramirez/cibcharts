package daos.monitoramento;

import com.avaje.ebean.Model;
import models.Propriedade;

import java.util.Optional;

public class PropriedadeDAO {

    private Model.Finder<Long, Propriedade> propriedades = new Model.Finder<>(Propriedade.class);

    public Optional<Propriedade> comNome(String nome) {

        Propriedade propriedade = propriedades.where().eq("nome", nome).findUnique();

        return Optional.ofNullable(propriedade);
    }
}
