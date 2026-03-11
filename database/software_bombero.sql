-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-06-07 21:50:35.859

-- tables
-- Table: bombero
CREATE TABLE bombero (
    id_institucion int  NOT NULL,
    id_bombero serial  NOT NULL,
    nombre varchar(20)  NOT NULL,
    apellido varchar(40)  NOT NULL,
    dni_bombero int  NOT NULL,
    fecha_nacimiento date  NOT NULL,
    categoria char(4)  NOT NULL,
    telefono varchar(20)  NOT NULL,
    e_mail varchar(60)  NULL,
    fecha_ingreso date  NULL,
    esta_disponible boolean  NOT NULL,
    horas_aportadas decimal(5,2)  NOT NULL,
    id_curso int  NULL,
    fecha_egreso date  NULL,
    CONSTRAINT ak_dni_bombero UNIQUE (dni_bombero) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT pk_bombero PRIMARY KEY (id_bombero)
);

-- Table: camion
CREATE TABLE camion (
    id_institucion int  NOT NULL,
    id_camion serial  NOT NULL,
    matricula_camion varchar(10)  NOT NULL,
    modelo_camion int  NULL,
    diponibilidad_camion boolean  NOT NULL,
    desc_estado_camion varchar(120)  NULL,
    CONSTRAINT ak_matricula_camion UNIQUE (matricula_camion) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT pk_camion PRIMARY KEY (id_camion)
);

-- Table: curso
CREATE TABLE curso (
    id_curso int  NOT NULL,
    nombre varchar(60)  NOT NULL,
    fecha_curso date  NULL,
    duracion date  NOT NULL,
    id_institucion int  NOT NULL,
    CONSTRAINT pk_curso PRIMARY KEY (id_curso)
);

-- Table: envio_msj
CREATE TABLE envio_msj (
    id_guardia int  NOT NULL,
    id_urgencia int  NOT NULL,
    id_mensaje serial  NOT NULL,
    mensaje varchar(120)  NOT NULL,
    si_asiste boolean  NULL,
    id_bombero int  NOT NULL,
    CONSTRAINT pk_envio_msj PRIMARY KEY (id_mensaje)
);

-- Table: esta_de
CREATE TABLE esta_de (
    id_bombero int  NOT NULL,
    id_guardia int  NOT NULL,
    CONSTRAINT pk_esta_de PRIMARY KEY (id_bombero,id_guardia)
);

-- Table: guardia
CREATE TABLE guardia (
    id_guardia serial  NOT NULL,
    fecha_guardia timestamp  NOT NULL,
    CONSTRAINT ak_fecha_guardia UNIQUE (fecha_guardia) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT pk_guardia PRIMARY KEY (id_guardia)
);

-- Table: institucion
CREATE TABLE institucion (
    id_institucion serial  NOT NULL,
    nombre varchar(40)  NULL,
    direccion varchar(40)  NOT NULL,
    provincia varchar(60)  NOT NULL,
    ciudad varchar(60)  NOT NULL,
    cod_postal int  NULL,
    CONSTRAINT pk_institucion PRIMARY KEY (id_institucion)
);

-- Table: inventario
CREATE TABLE inventario (
    cod_pieza int  NOT NULL,
    nombre varchar(120)  NOT NULL,
    descripcion varchar(240)  NULL,
    id_institucion int  NOT NULL,
    id_camion int  NOT NULL,
    CONSTRAINT inventario_pk PRIMARY KEY (cod_pieza)
);

-- Table: manejado_por
CREATE TABLE manejado_por (
    id_camion int  NOT NULL,
    id_bombero int  NOT NULL,
    CONSTRAINT pk_manejado_por PRIMARY KEY (id_bombero,id_camion)
);

-- Table: se_encuentra_en
CREATE TABLE se_encuentra_en (
    id_bombero int  NOT NULL,
    id_urgencia int  NOT NULL,
    id_guardia int  NOT NULL,
    CONSTRAINT PK_SE_ENCUENTRA_EN PRIMARY KEY (id_bombero,id_urgencia,id_guardia)
);

-- Table: urgencia
CREATE TABLE urgencia (
    id_guardia int  NOT NULL,
    id_urgencia serial  NOT NULL,
    nombre_urgencia varchar(60)  NULL,
    direccion_urgencia varchar(60)  NOT NULL,
    tipo_urgencia char(3)  NOT NULL,
    estado_urgencia char(3)  NULL,
    mensaje_adicional varchar(120)  NULL,
    CONSTRAINT pk_urgencia PRIMARY KEY (id_urgencia)
);

-- foreign keys
-- Reference: fk_bombero_curso (table: bombero)
ALTER TABLE bombero ADD CONSTRAINT fk_bombero_curso
    FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_bombero_institucion (table: bombero)
ALTER TABLE bombero ADD CONSTRAINT fk_bombero_institucion
    FOREIGN KEY (id_institucion)
    REFERENCES institucion (id_institucion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_camion_institucion (table: camion)
ALTER TABLE camion ADD CONSTRAINT fk_camion_institucion
    FOREIGN KEY (id_institucion)
    REFERENCES institucion (id_institucion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_curso_institucion (table: curso)
ALTER TABLE curso ADD CONSTRAINT fk_curso_institucion
    FOREIGN KEY (id_institucion)
    REFERENCES institucion (id_institucion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_envio_msj_bombero (table: envio_msj)
ALTER TABLE envio_msj ADD CONSTRAINT fk_envio_msj_bombero
    FOREIGN KEY (id_bombero)
    REFERENCES bombero (id_bombero)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_envio_msj_urgencia (table: envio_msj)
ALTER TABLE envio_msj ADD CONSTRAINT fk_envio_msj_urgencia
    FOREIGN KEY (id_urgencia)
    REFERENCES urgencia (id_urgencia)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_es_de_bombero (table: esta_de)
ALTER TABLE esta_de ADD CONSTRAINT fk_es_de_bombero
    FOREIGN KEY (id_bombero)
    REFERENCES bombero (id_bombero)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_esta_de_guardia (table: esta_de)
ALTER TABLE esta_de ADD CONSTRAINT fk_esta_de_guardia
    FOREIGN KEY (id_guardia)
    REFERENCES guardia (id_guardia)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_inventario_camion (table: inventario)
ALTER TABLE inventario ADD CONSTRAINT fk_inventario_camion
    FOREIGN KEY (id_camion)
    REFERENCES camion (id_camion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_inventario_institucion (table: inventario)
ALTER TABLE inventario ADD CONSTRAINT fk_inventario_institucion
    FOREIGN KEY (id_institucion)
    REFERENCES institucion (id_institucion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_manejado_por_bombero (table: manejado_por)
ALTER TABLE manejado_por ADD CONSTRAINT fk_manejado_por_bombero
    FOREIGN KEY (id_bombero)
    REFERENCES bombero (id_bombero)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_manejado_por_camion (table: manejado_por)
ALTER TABLE manejado_por ADD CONSTRAINT fk_manejado_por_camion
    FOREIGN KEY (id_camion)
    REFERENCES camion (id_camion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_se_encuentra_en_bombero (table: se_encuentra_en)
ALTER TABLE se_encuentra_en ADD CONSTRAINT fk_se_encuentra_en_bombero
    FOREIGN KEY (id_bombero)
    REFERENCES bombero (id_bombero)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_se_encuentra_en_urgencia (table: se_encuentra_en)
ALTER TABLE se_encuentra_en ADD CONSTRAINT fk_se_encuentra_en_urgencia
    FOREIGN KEY (id_urgencia)
    REFERENCES urgencia (id_urgencia)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_urgencia_guardia (table: urgencia)
ALTER TABLE urgencia ADD CONSTRAINT fk_urgencia_guardia
    FOREIGN KEY (id_guardia)
    REFERENCES guardia (id_guardia)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

