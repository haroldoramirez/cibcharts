# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table base_calculada_dia (
  id                            bigserial not null,
  ano                           integer not null,
  mes                           integer not null,
  dia                           integer not null,
  total_ping                    varchar(255) not null,
  total_falha                   varchar(255) not null,
  indicador                     varchar(255) not null,
  data_alteracao                timestamp,
  propriedade_id                bigint,
  status                        boolean not null,
  manutencao                    boolean not null,
  constraint pk_base_calculada_dia primary key (id)
);

create table base_ping (
  id                            bigserial not null,
  data_do_ping                  timestamp not null,
  socket_connection_test        varchar(5) not null,
  http_connection_test          varchar(5) not null,
  propriedade_id                bigint,
  constraint pk_base_ping primary key (id)
);

create table base_total (
  id                            bigserial not null,
  ano                           integer not null,
  mes                           integer not null,
  total_ping                    varchar(255) not null,
  total_falha                   varchar(255) not null,
  indicador                     varchar(255) not null,
  data_alteracao                timestamp not null,
  propriedade_id                bigint,
  constraint pk_base_total primary key (id)
);

create table cidade (
  id                            bigserial not null,
  nome                          varchar(200) not null,
  estado_id                     bigint,
  constraint uq_cidade_nome unique (nome),
  constraint pk_cidade primary key (id)
);

create table estado (
  id                            bigserial not null,
  nome                          varchar(200) not null,
  constraint uq_estado_nome unique (nome),
  constraint pk_estado primary key (id)
);

create table estatistica (
  id                            bigserial not null,
  monitoramento_id              bigint,
  parametros_id                 bigint,
  media                         float not null,
  mediana                       float not null,
  maximo                        float not null,
  minimo                        float not null,
  desvio_padrao                 float not null,
  assimetria                    float not null,
  moda                          float not null,
  amplitude                     float not null,
  data_registro                 timestamp not null,
  constraint pk_estatistica primary key (id)
);

create table gerador (
  id                            bigserial not null,
  nome                          varchar(45),
  descricao                     varchar(150),
  modelo_gerador_id             bigint,
  propriedade_id                bigint,
  ano                           integer,
  potencia                      varchar(45),
  constraint pk_gerador primary key (id)
);

create table localidade (
  id                            bigserial not null,
  nome                          varchar(200) not null,
  cidade_id                     bigint,
  constraint uq_localidade_nome unique (nome),
  constraint pk_localidade primary key (id)
);

create table log (
  id                            bigserial not null,
  mensagem                      varchar(500) not null,
  navegador                     varchar(100),
  versao                        varchar(100),
  so                            varchar(100),
  data_cadastro                 timestamp not null,
  constraint pk_log primary key (id)
);

create table modelo_gerador (
  id                            bigserial not null,
  nome                          varchar(45),
  descricao                     varchar(150),
  constraint pk_modelo_gerador primary key (id)
);

create table monitoramento (
  id                            bigserial not null,
  gerador_id                    bigint,
  obs                           varchar(45),
  constraint pk_monitoramento primary key (id)
);

create table monitoramento_parametro (
  id                            bigserial not null,
  monitoramento_id              bigint,
  parametros_id                 bigint,
  valor                         float,
  constraint pk_monitoramento_parametro primary key (id)
);

create table parametros (
  id                            bigserial not null,
  unidade                       varchar(45),
  descricao                     varchar(150),
  constraint pk_parametros primary key (id)
);

create table propriedade (
  id                            bigserial not null,
  nome                          varchar(200) not null,
  data_cadastro                 timestamp not null,
  data_alteracao                timestamp,
  constraint uq_propriedade_nome unique (nome),
  constraint pk_propriedade primary key (id)
);

create table token (
  token                         varchar(255) not null,
  usuario_id                    bigint,
  type                          varchar(8),
  date_creation                 date,
  email                         varchar(255),
  constraint ck_token_type check (type in ('password','email')),
  constraint pk_token primary key (token)
);

create table token_api (
  id                            bigserial not null,
  usuario_id                    bigint,
  codigo                        varchar(255),
  expiracao                     timestamp,
  constraint uq_token_api_usuario_id unique (usuario_id),
  constraint pk_token_api primary key (id)
);

create table usuario (
  id                            bigserial not null,
  confirmacao_token             varchar(255),
  validado                      boolean,
  nome                          varchar(60) not null,
  email                         varchar(50) not null,
  senha                         varchar(255) not null,
  papel                         varchar(13),
  status                        boolean not null,
  data_cadastro                 date,
  data_alteracao                date,
  ultimo_acesso                 timestamp not null,
  constraint ck_usuario_papel check (papel in ('USUARIO','GERENTE','ADMINISTRADOR')),
  constraint uq_usuario_email unique (email),
  constraint pk_usuario primary key (id)
);

alter table base_calculada_dia add constraint fk_base_calculada_dia_propriedade_id foreign key (propriedade_id) references propriedade (id) on delete restrict on update restrict;
create index ix_base_calculada_dia_propriedade_id on base_calculada_dia (propriedade_id);

alter table base_ping add constraint fk_base_ping_propriedade_id foreign key (propriedade_id) references propriedade (id) on delete restrict on update restrict;
create index ix_base_ping_propriedade_id on base_ping (propriedade_id);

alter table base_total add constraint fk_base_total_propriedade_id foreign key (propriedade_id) references propriedade (id) on delete restrict on update restrict;
create index ix_base_total_propriedade_id on base_total (propriedade_id);

alter table cidade add constraint fk_cidade_estado_id foreign key (estado_id) references estado (id) on delete restrict on update restrict;
create index ix_cidade_estado_id on cidade (estado_id);

alter table estatistica add constraint fk_estatistica_monitoramento_id foreign key (monitoramento_id) references monitoramento (id) on delete restrict on update restrict;
create index ix_estatistica_monitoramento_id on estatistica (monitoramento_id);

alter table estatistica add constraint fk_estatistica_parametros_id foreign key (parametros_id) references parametros (id) on delete restrict on update restrict;
create index ix_estatistica_parametros_id on estatistica (parametros_id);

alter table gerador add constraint fk_gerador_modelo_gerador_id foreign key (modelo_gerador_id) references modelo_gerador (id) on delete restrict on update restrict;
create index ix_gerador_modelo_gerador_id on gerador (modelo_gerador_id);

alter table gerador add constraint fk_gerador_propriedade_id foreign key (propriedade_id) references propriedade (id) on delete restrict on update restrict;
create index ix_gerador_propriedade_id on gerador (propriedade_id);

alter table localidade add constraint fk_localidade_cidade_id foreign key (cidade_id) references cidade (id) on delete restrict on update restrict;
create index ix_localidade_cidade_id on localidade (cidade_id);

alter table monitoramento add constraint fk_monitoramento_gerador_id foreign key (gerador_id) references gerador (id) on delete restrict on update restrict;
create index ix_monitoramento_gerador_id on monitoramento (gerador_id);

alter table monitoramento_parametro add constraint fk_monitoramento_parametro_monitoramento_id foreign key (monitoramento_id) references monitoramento (id) on delete restrict on update restrict;
create index ix_monitoramento_parametro_monitoramento_id on monitoramento_parametro (monitoramento_id);

alter table monitoramento_parametro add constraint fk_monitoramento_parametro_parametros_id foreign key (parametros_id) references parametros (id) on delete restrict on update restrict;
create index ix_monitoramento_parametro_parametros_id on monitoramento_parametro (parametros_id);

alter table token_api add constraint fk_token_api_usuario_id foreign key (usuario_id) references usuario (id) on delete restrict on update restrict;


# --- !Downs

alter table base_calculada_dia drop constraint if exists fk_base_calculada_dia_propriedade_id;
drop index if exists ix_base_calculada_dia_propriedade_id;

alter table base_ping drop constraint if exists fk_base_ping_propriedade_id;
drop index if exists ix_base_ping_propriedade_id;

alter table base_total drop constraint if exists fk_base_total_propriedade_id;
drop index if exists ix_base_total_propriedade_id;

alter table cidade drop constraint if exists fk_cidade_estado_id;
drop index if exists ix_cidade_estado_id;

alter table estatistica drop constraint if exists fk_estatistica_monitoramento_id;
drop index if exists ix_estatistica_monitoramento_id;

alter table estatistica drop constraint if exists fk_estatistica_parametros_id;
drop index if exists ix_estatistica_parametros_id;

alter table gerador drop constraint if exists fk_gerador_modelo_gerador_id;
drop index if exists ix_gerador_modelo_gerador_id;

alter table gerador drop constraint if exists fk_gerador_propriedade_id;
drop index if exists ix_gerador_propriedade_id;

alter table localidade drop constraint if exists fk_localidade_cidade_id;
drop index if exists ix_localidade_cidade_id;

alter table monitoramento drop constraint if exists fk_monitoramento_gerador_id;
drop index if exists ix_monitoramento_gerador_id;

alter table monitoramento_parametro drop constraint if exists fk_monitoramento_parametro_monitoramento_id;
drop index if exists ix_monitoramento_parametro_monitoramento_id;

alter table monitoramento_parametro drop constraint if exists fk_monitoramento_parametro_parametros_id;
drop index if exists ix_monitoramento_parametro_parametros_id;

alter table token_api drop constraint if exists fk_token_api_usuario_id;

drop table if exists base_calculada_dia cascade;

drop table if exists base_ping cascade;

drop table if exists base_total cascade;

drop table if exists cidade cascade;

drop table if exists estado cascade;

drop table if exists estatistica cascade;

drop table if exists gerador cascade;

drop table if exists localidade cascade;

drop table if exists log cascade;

drop table if exists modelo_gerador cascade;

drop table if exists monitoramento cascade;

drop table if exists monitoramento_parametro cascade;

drop table if exists parametros cascade;

drop table if exists propriedade cascade;

drop table if exists token cascade;

drop table if exists token_api cascade;

drop table if exists usuario cascade;

