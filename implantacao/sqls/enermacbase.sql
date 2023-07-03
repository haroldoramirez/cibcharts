CREATE DATABASE enermac
WITH
OWNER = ernex
ENCODING = 'UTF8'
LC_COLLATE = 'pt_BR.UTF-8'
LC_CTYPE = 'pt_BR.UTF-8'
TABLESPACE = pg_default
CONNECTION LIMIT = -1;

create table modelo_gerador (
id serial not null,
nome varchar(150),
ano varchar(5),
potencia varchar(150),
constraint pk_modelo_gerador primary key (id)
);
create sequence modelo_gerador_seq;
ALTER TABLE modelo_gerador OWNER TO ernex;

create table monitoramento (
id serial not null,
modelo_gerador_id bigint,
parametros_id bigint,
valor varchar(50),
constraint pk_monitoramento primary key (id)
);

create sequence monitoramento_seq;
ALTER TABLE monitoramento OWNER TO ernex;

create table parametros (
id serial not null,
descricao varchar(150),
unidade varchar(50),
constraint pk_parametros primary key (id)
);

create sequence parametros_seq;
ALTER TABLE parametros OWNER TO ernex;

alter table monitoramento add constraint fk_monitoramento_modelo_gerador_id foreign key (modelo_gerador_id) references modelo_gerador (id) on delete restrict on update restrict;
create index ix_monitoramento_modelo_gerador_id on monitoramento (modelo_gerador_id);

alter table monitoramento add constraint fk_monitoramento_parametros_id foreign key (parametros_id) references parametros (id) on delete restrict on update restrict;
create index ix_monitoramento_parametros_id on monitoramento (parametros_id);

insert into parametros (descricao, unidade) values ('Temperatura', 'ºC');
insert into modelo_gerador (nome, ano,potencia) values ('Enermac 1', '2015', '200');
insert into monitoramento (modelo_gerador_id, parametros_id, valor) values (1,1,200);

------------------------------------------------



alter table estatistica add column minimo float;