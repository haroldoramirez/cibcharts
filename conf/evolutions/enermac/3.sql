# --- Sample dataset

# --- !Ups

insert into estado (nome) values ('Paraná');
insert into estado (nome) values ('Santa Catarina');
insert into estado (nome) values ('São Paulo');

insert into parametros (unidade, descricao) values ('ºC', 'Temperatura');
insert into parametros (unidade, descricao) values ('mBar', 'Pressão');
insert into parametros (unidade, descricao) values ('kg', 'Massa');

insert into cidade (nome, estado_id) values ('Foz do Iguaçu', 1);
insert into cidade (nome, estado_id) values ('Florianópolis', 2);
insert into cidade (nome, estado_id) values ('Campinas', 3);

insert into localidade (nome, cidade_id) values ('Localidade 1', 1);
insert into localidade (nome, cidade_id) values ('Localidade 2', 2);
insert into localidade (nome, cidade_id) values ('Localidade 3', 3);

insert into propriedade (proprietario, finalidade, localidade_id) values ('Fulano 1', 'Finalidade 1', 1);
insert into propriedade (proprietario, finalidade, localidade_id) values ('Fulano 2', 'Finalidade 2', 2);
insert into propriedade (proprietario, finalidade, localidade_id) values ('Fulano 3', 'Finalidade 2', 3);

insert into modelo_gerador (nome, descricao) values ('Modelo 1 Teste', 'Descricao Teste');

insert into gerador (nome, descricao, modelo_gerador_id, propriedade_id, ano, potencia) values ('Gerador 1', 'descricao 1', 1, 1, 2015, '1000W');

insert into monitoramento (gerador_id, obs) values (1, 'OBS 1');

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 40.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 52.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 60.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 80.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.5);

insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 150.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 181.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 202.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 250.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 280.4);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 320.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 390.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 389.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 325.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 289.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 263.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 160.4);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 120.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 90.6);



insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 1.22);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 12.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 20.0);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 30.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 45.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 59.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 69.4);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 51.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 79.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 89.7);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 96.8);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 115.9);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 136.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 149.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 169.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 189.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 196.4);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 3.22);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 17.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 21.0);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 35.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 49.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 57.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 61.4);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 69.5);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 72.6);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 86.7);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 94.8);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 105.9);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 111.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 131.1);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 141.2);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 151.3);
insert into monitoramento_parametro (monitoramento_id, parametros_id, valor) values (1, 1, 161.4);

insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 78.33, 78.80, 79.30, 77.30, 0.65, 0.00, 78.30, 2.00, 'now');
insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 78.33, 78.80, 79.30, 77.30, 0.65, 0.00, 78.30, 2.00, 'now');
insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 78.33, 78.80, 79.30, 77.30, 0.65, 0.00, 78.30, 2.00, 'now');

insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 10.33, 20.80, 30.30, 45.30, 0.89, 0.00, 68.30, 1.00, 'now');
insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 29.33, 39.80, 58.30, 69.30, 0.89, 0.00, 79.30, 1.00, 'now');
insert into estatistica (monitoramento_id, parametros_id, media, mediana, maximo, minimo, desvio_padrao, assimetria, moda, amplitude, data_registro)
    values(1, 1, 48.33, 56.80, 63.30, 67.30, 0.89, 0.00, 89.30, 1.00, 'now');