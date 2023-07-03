package models;

import java.util.List;

public class EnvelopeDeBasesTotais {

    private List<BaseTotal> basesTotais;

    public EnvelopeDeBasesTotais(List<BaseTotal> basesTotais) {
        this.basesTotais = basesTotais;
    }

    public List<BaseTotal> getBasesTotais() {
        return basesTotais;
    }
}
