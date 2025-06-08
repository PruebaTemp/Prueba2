DROP TABLE IF EXISTS control CASCADE;
DROP TABLE IF EXISTS terapia CASCADE;
DROP TABLE IF EXISTS perfil_alergias CASCADE;
DROP TABLE IF EXISTS turno CASCADE; 
DROP TABLE IF EXISTS relacion_personas CASCADE;
DROP TABLE IF EXISTS intervencion_quirurgica CASCADE;
DROP TABLE IF EXISTS tratamiento_medicamento CASCADE;
DROP TABLE IF EXISTS sintoma CASCADE;
DROP TABLE IF EXISTS examen CASCADE;
DROP TABLE IF EXISTS ingreso_hospitalizacion CASCADE;
DROP TABLE IF EXISTS alta_hospitalizacion CASCADE;
DROP TABLE IF EXISTS tratamiento CASCADE;
DROP TABLE IF EXISTS diagnostico CASCADE;
DROP TABLE IF EXISTS consulta_medica CASCADE;
DROP TABLE IF EXISTS servicio_medico CASCADE;
DROP TABLE IF EXISTS cita_medica CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS paciente CASCADE;
DROP TABLE IF EXISTS asignacion_rol CASCADE;
DROP TABLE IF EXISTS historia_clinica CASCADE;
DROP TABLE IF EXISTS personal_medico CASCADE;
DROP TABLE IF EXISTS administrador CASCADE;
DROP TABLE IF EXISTS perfil_medico CASCADE;
DROP TABLE IF EXISTS persona CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS estado_historia_clinica CASCADE;
DROP TABLE IF EXISTS alergia CASCADE;
DROP TABLE IF EXISTS morbilidad CASCADE;
DROP TABLE IF EXISTS medicamento CASCADE;
DROP TABLE IF EXISTS especialidad CASCADE;
DROP TABLE IF EXISTS tipo_servicio CASCADE;
DROP TABLE IF EXISTS tipo_relacion CASCADE;
DROP TABLE IF EXISTS subtipo_servicio CASCADE;
DROP TABLE IF EXISTS unidad_tiempo CASCADE;
DROP TABLE IF EXISTS cie10 CASCADE;
DROP TABLE IF EXISTS orden_medica CASCADE;
DROP TABLE IF EXISTS cita_atencion_orden CASCADE;


CREATE TABLE tipo_servicio (
    id_tipo_servicio SERIAL,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_tipo_servicio)
);


CREATE TABLE IF NOT EXISTS subtipo_servicio (
    id_subtipo_servicio SERIAL,
    nombre VARCHAR(100) NOT NULL,
    id_tipo_servicio INT NOT NULL,
    PRIMARY KEY (id_subtipo_servicio),
    CONSTRAINT id_tipo_servicio
    FOREIGN KEY (id_tipo_servicio)
    REFERENCES tipo_servicio(id_tipo_servicio)
);

CREATE TABLE IF NOT EXISTS tipo_relacion (
    id_tipo_relacion SERIAL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(256) NOT NULL,
    PRIMARY KEY (id_tipo_relacion)
);

CREATE TABLE IF NOT EXISTS especialidad (
    id_especialidad SERIAL,
    descripcion VARCHAR(150) NOT NULL,
    area_asignada VARCHAR(50) NOT NULL,
    nivel_experiencia VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_especialidad)
);

CREATE TABLE IF NOT EXISTS medicamento (
    id_medicamento SERIAL,
    nombre_comercial VARCHAR(100) NOT NULL, 
    metodo_administracion VARCHAR(100),
    concentracion VARCHAR(50),
    laboratorio VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_medicamento)
);

CREATE TABLE IF NOT EXISTS cie10 (
    id_cie10 SERIAL,
    codigo CHAR(3),
    descripcion VARCHAR(250),
    PRIMARY KEY (id_cie10)
);

CREATE TABLE IF NOT EXISTS morbilidad (
    id_morbilidad SERIAL,
    id_cie10 INT NOT NULL,
    descripcion VARCHAR(250),
    fecha_identificacion DATE,
    tipo VARCHAR(50) NOT NULL,
    nivel_gravedad VARCHAR(50),
    contagiosa BOOLEAN,
    PRIMARY KEY (id_morbilidad),
    CONSTRAINT id_cie10
    FOREIGN KEY (id_cie10)
    REFERENCES cie10(id_cie10)
);

CREATE TABLE IF NOT EXISTS alergia (
    id_alergia SERIAL,
    nombre_alergia VARCHAR(100) NOT NULL,
    componente_alergeno VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_alergia)
);

CREATE TABLE IF NOT EXISTS estado_historia_clinica (
    id_estado SERIAL,
    nombre_estado VARCHAR(50),
    descripcion VARCHAR(100),
    PRIMARY KEY (id_estado)
);

CREATE TABLE IF NOT EXISTS rol (
    id_rol SERIAL,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(50),
    PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS persona (
    id_persona SERIAL,
    prenombres VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100) NOT NULL,
    dni_idcarnet CHAR(8) UNIQUE NOT NULL,
    sexo CHAR(1) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion_legal VARCHAR(200) NOT NULL,
    correo_electronico VARCHAR(100),
    numero_celular_personal VARCHAR(15),
    numero_celular_emergencia VARCHAR(15),
    PRIMARY KEY (id_persona)
);

CREATE TABLE IF NOT EXISTS relacion_personas (
    id_persona_1 INT NOT NULL,
    id_persona_2 INT NOT NULL,
    id_tipo_relacion INT NOT NULL,
    fecha_asignacion DATE NOT NULL,
    fecha_expiracion DATE NULL,
    observaciones VARCHAR(256) NOT NULL,
    CONSTRAINT id_persona_1
    FOREIGN KEY (id_persona_1)
    REFERENCES persona(id_persona),
    CONSTRAINT id_persona_2
    FOREIGN KEY (id_persona_2)
    REFERENCES persona(id_persona),
    CONSTRAINT id_tipo_relacion
    FOREIGN KEY (id_tipo_relacion)
    REFERENCES tipo_relacion(id_tipo_relacion),
    PRIMARY KEY (id_persona_1, id_persona_2, id_tipo_relacion)
);

CREATE TABLE IF NOT EXISTS perfil_medico (
    id_perfil_medico SERIAL,
    fecha_atencion TIMESTAMP NOT NULL,
    grupo_sanguineo VARCHAR(3),
    ambiente_residencia VARCHAR(50), 
    orientacion_sexual VARCHAR(30),
    vida_sexual_activa BOOLEAN,
    PRIMARY KEY (id_perfil_medico)
);

CREATE TABLE IF NOT EXISTS perfil_alergias (
    id_perfil_alergias SERIAL,
    id_perfil_medico INT NOT NULL,
    id_alergia INT NOT NULL,
    PRIMARY KEY (id_perfil_alergias),
    CONSTRAINT id_perfil_medico
    FOREIGN KEY (id_perfil_medico)
    REFERENCES perfil_medico(id_perfil_medico),
    CONSTRAINT id_alergia
    FOREIGN KEY (id_alergia)
    REFERENCES alergia(id_alergia)
);

CREATE TABLE IF NOT EXISTS administrador (
    id_administrador SERIAL,
    id_persona INT NOT NULL,
    cargo VARCHAR(50),
    nivel_acceso VARCHAR(50),
    PRIMARY KEY (id_administrador),
    CONSTRAINT id_persona 
    FOREIGN KEY (id_persona) 
    REFERENCES persona(id_persona)
);

CREATE TABLE IF NOT EXISTS personal_medico (
    id_personal_medico SERIAL,
    id_persona INT NOT NULL,
    id_especialidad SMALLINT NOT NULL,
    licencia_medica VARCHAR(50),
    colegiatura VARCHAR(50),
    habilitado BOOLEAN,
    institucion_asociada VARCHAR(100),
    PRIMARY KEY (id_personal_medico),
    CONSTRAINT id_persona
    FOREIGN KEY (id_persona) 
    REFERENCES persona(id_persona),
    CONSTRAINT id_especialidad
    FOREIGN KEY (id_especialidad) 
    REFERENCES especialidad(id_especialidad)
);

CREATE TABLE IF NOT EXISTS turno (
    id_turno SERIAL,
    id_personal_medico INT NOT NULL,
    dia_semana SMALLINT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    PRIMARY KEY (id_turno),
    CONSTRAINT id_personal_medico 
    FOREIGN KEY (id_personal_medico) 
    REFERENCES personal_medico(id_personal_medico)
);

CREATE TABLE IF NOT EXISTS historia_clinica (
    id_historia SERIAL,
    id_estado SMALLINT NOT NULL,
    id_perfil_medico INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    PRIMARY KEY (id_historia),
    CONSTRAINT id_estado 
    FOREIGN KEY (id_estado) 
    REFERENCES estado_historia_clinica(id_estado),
    CONSTRAINT id_perfil_medico 
    FOREIGN KEY (id_perfil_medico) 
    REFERENCES perfil_medico(id_perfil_medico)
);

CREATE TABLE IF NOT EXISTS paciente (
    id_paciente SERIAL,
    id_persona INT NOT NULL,
    id_historia INT NOT NULL,
    tipo_seguro VARCHAR(50),
    situacion_juridica VARCHAR(50),
    esta_vivo BOOLEAN,
    etapa_vida VARCHAR(50),
    PRIMARY KEY (id_paciente),
    CONSTRAINT id_persona 
    FOREIGN KEY (id_persona) 
    REFERENCES persona(id_persona),
    CONSTRAINT id_historia 
    FOREIGN KEY (id_historia) 
    REFERENCES historia_clinica(id_historia)
);

CREATE TABLE IF NOT EXISTS asignacion_rol (
    id_asignacion_rol SERIAL,
    id_persona INT NOT NULL,
    id_rol SMALLINT NOT NULL,
    fecha_asignacion DATE NOT NULL,
    fecha_expiracion DATE,
    PRIMARY KEY (id_asignacion_rol),
    CONSTRAINT id_persona
    FOREIGN KEY (id_persona) 
    REFERENCES persona(id_persona),
    CONSTRAINT id_rol 
    FOREIGN KEY (id_rol) 
    REFERENCES rol(id_rol)
);

CREATE TABLE IF NOT EXISTS solicitud (
    id_solicitud SERIAL,
    id_persona INT NOT NULL,
    id_administrador INT NOT NULL,
    descripcion VARCHAR(100),
    motivo VARCHAR(200), 
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_solicitud VARCHAR(20) DEFAULT 'Pendiente',
    PRIMARY KEY (id_solicitud),
    CONSTRAINT id_persona
    FOREIGN KEY (id_persona) 
    REFERENCES persona(id_persona),
    CONSTRAINT id_administrador
    FOREIGN KEY (id_administrador) 
    REFERENCES administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS cita_medica (
    id_cita_medica SERIAL,
    id_paciente INT NOT NULL,
    id_personal_medico INT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    actividad VARCHAR(100),
    fecha_hora_programada TIMESTAMP NOT NULL,
    PRIMARY KEY (id_cita_medica),
    CONSTRAINT id_paciente
    FOREIGN KEY (id_paciente)
    REFERENCES paciente(id_paciente),
    CONSTRAINT id_personal_medico
    FOREIGN KEY (id_personal_medico)
    REFERENCES personal_medico(id_personal_medico)
);

CREATE TABLE IF NOT EXISTS servicio_medico (
    id_servicio_medico SERIAL,
    id_cita_medica INT NOT NULL,
    fecha_servicio DATE NOT NULL,
    hora_inicio_servicio TIME NOT NULL,
    hora_fin_servicio TIME NOT NULL,
    PRIMARY KEY (id_servicio_medico),
    CONSTRAINT id_cita_medica 
    FOREIGN KEY (id_cita_medica) 
    REFERENCES cita_medica(id_cita_medica)
);

CREATE TABLE IF NOT EXISTS consulta_medica (
    id_consulta_medica SERIAL,
    id_servicio_medico INT NOT NULL,
    observaciones_generales VARCHAR(500),
    motivo_consulta VARCHAR(500),
    id_tipo_servicio INT NOT NULL,
    id_subtipo_servicio INT NOT NULL,
    PRIMARY KEY (id_consulta_medica),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico) 
    REFERENCES servicio_medico(id_servicio_medico),
    CONSTRAINT id_tipo_servicio
    FOREIGN KEY (id_tipo_servicio)
    REFERENCES tipo_servicio(id_tipo_servicio),
    CONSTRAINT id_subtipo_servicio
    FOREIGN KEY (id_subtipo_servicio)
    REFERENCES subtipo_servicio(id_subtipo_servicio)
);

CREATE TABLE orden_medica (
    id_orden SERIAL,
    motivo TEXT,
    observaciones TEXT,
    id_tipo_servicio INT NOT NULL,
    id_subtipo_servicio INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    PRIMARY KEY (id_orden),
    CONSTRAINT id_tipo_servicio
    FOREIGN KEY (id_tipo_servicio)
    REFERENCES tipo_servicio(id_tipo_servicio),
    CONSTRAINT id_subtipo_servicio
    FOREIGN KEY (id_subtipo_servicio)
    REFERENCES subtipo_servicio(id_subtipo_servicio)
    
);

CREATE TABLE cita_atencion_orden (
    id_orden INT NOT NULL,
    id_cita_medica INT NOT NULL,
    PRIMARY KEY (id_orden, id_cita_medica),
    CONSTRAINT id_orden
    FOREIGN KEY (id_orden)
    REFERENCES orden_medica(id_orden),
    CONSTRAINT id_cita_medica 
    FOREIGN KEY (id_cita_medica)
    REFERENCES cita_medica(id_cita_medica)
);

CREATE TABLE IF NOT EXISTS diagnostico (
    id_diagnostico SERIAL,
    id_morbilidad INT NOT NULL,
    id_servicio_medico INT NOT NULL,
    detalle VARCHAR(100),
    PRIMARY KEY (id_diagnostico),
    CONSTRAINT id_morbilidad
    FOREIGN KEY (id_morbilidad)
    REFERENCES morbilidad(id_morbilidad),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico) 
    REFERENCES servicio_medico(id_servicio_medico)
);



CREATE TABLE IF NOT EXISTS unidad_tiempo (
    id_unid_tiempo SERIAL,
    nombre VARCHAR(20),
    PRIMARY KEY (id_unid_tiempo)
);

CREATE TABLE IF NOT EXISTS tratamiento (
    id_tratamiento SERIAL,
    id_servicio_medico INT NOT NULL,
    razon VARCHAR(200),
    id_unid_tiempo INT NOT NULL,
    duracion_cantidad SMALLINT,
    observaciones VARCHAR(200),
    PRIMARY KEY (id_tratamiento),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico) 
    REFERENCES servicio_medico(id_servicio_medico),
    CONSTRAINT id_unid_tiempo
    FOREIGN KEY (id_unid_tiempo) 
    REFERENCES unidad_tiempo(id_unid_tiempo)
);

CREATE TABLE IF NOT EXISTS examen (
    id_examen SERIAL,
    id_servicio_medico INT NOT NULL,
    descripcion_procedimiento VARCHAR(250),
    fecha_hora_atencion TIMESTAMP NOT NULL,
    descripcion VARCHAR(250),
    tipo_procedimiento VARCHAR(250),
    tipo_laboratorio VARCHAR(250),
    resultado VARCHAR(300),
    PRIMARY KEY (id_examen),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico) 
    REFERENCES servicio_medico(id_servicio_medico)
);

CREATE TABLE IF NOT EXISTS sintoma (
    id_sintoma SERIAL,
    id_diagnostico INT NOT NULL,
    nombre_sintoma VARCHAR(100) NOT NULL,
    fecha_primera_manifestacion DATE NOT NULL,
    descripcion VARCHAR(200),
    severidad INT NOT NULL,
    estado_actual VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_sintoma),
    CONSTRAINT id_diagnostico
    FOREIGN KEY (id_diagnostico)
    REFERENCES diagnostico(id_diagnostico)
);

CREATE TABLE IF NOT EXISTS tratamiento_medicamento (
    id_tratamiento_medicamento SERIAL,
    id_tratamiento INT NOT NULL,
    id_medicamento INT NOT NULL,
    motivo VARCHAR(100),
    cantidad_dosis INT NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_tratamiento_medicamento),
    CONSTRAINT id_tratamiento
    FOREIGN KEY (id_tratamiento)
    REFERENCES tratamiento(id_tratamiento),
    CONSTRAINT id_medicamento
    FOREIGN KEY (id_medicamento) 
    REFERENCES medicamento(id_medicamento)
);

CREATE TABLE IF NOT EXISTS intervencion_quirurgica (
    id_intervencion SERIAL,
    id_servicio_medico INT NOT NULL,
    procedimiento_quirurgico VARCHAR(250),
    tipo_anestesia VARCHAR(50),
    observaciones VARCHAR(250),
    PRIMARY KEY (id_intervencion),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico)
    REFERENCES servicio_medico(id_servicio_medico)
);

CREATE TABLE IF NOT EXISTS control (
    id_control SERIAL,
    id_servicio_medico INT NOT NULL,
    pulso_cardiaco INT NOT NULL,
    presion_diastolica INT NOT NULL,
    presion_sistolica INT NOT NULL,
    oxigenacion INT NOT NULL,
    estado_paciente VARCHAR(50),
    observaciones VARCHAR(100),
    PRIMARY KEY (id_control),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico)
    REFERENCES servicio_medico(id_servicio_medico)
);

CREATE TABLE IF NOT EXISTS ingreso_hospitalizacion (
    id_ingreso_hospitalizacion SERIAL,
    id_servicio_medico INT NOT NULL,
    razon_ingreso VARCHAR(250),
    atenciones_necesarias VARCHAR(250),
    fecha_estimada_alta DATE,
    nro_camas SMALLINT,
    PRIMARY KEY (id_ingreso_hospitalizacion),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico)
    REFERENCES servicio_medico(id_servicio_medico)
);

CREATE TABLE IF NOT EXISTS alta_hospitalizacion (
    id_alta_hospitalizacion SERIAL,
    id_servicio_medico INT NOT NULL,
    indicaciones_postalta VARCHAR(250),
    motivo_alta VARCHAR(250),
    PRIMARY KEY (id_alta_hospitalizacion ),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico)
    REFERENCES servicio_medico(id_servicio_medico)
);

CREATE TABLE IF NOT EXISTS terapia (
    id_terapia SERIAL,
    id_servicio_medico INT NOT NULL,
    descripcion VARCHAR(250),
    observaciones VARCHAR(250),
    resultados VARCHAR(250),
    PRIMARY KEY (id_terapia),
    CONSTRAINT id_servicio_medico
    FOREIGN KEY (id_servicio_medico)
    REFERENCES servicio_medico(id_servicio_medico)
);

/* --------------------------------------------------------
 * ----------------------- SGHC ---------------------------
 * -------------------------------------------------------- */


--  DATOS PARA LA TABLA PERSONA
INSERT INTO persona (id_persona, prenombres, primer_apellido, segundo_apellido, dni_idcarnet, sexo, fecha_nacimiento, direccion_legal, correo_electronico, numero_celular_personal, numero_celular_emergencia) VALUES
(1, 'Pedro', 'Domínguez', 'Ruiz', '10420951', 'M', '1985-05-15', 'Av. Arequipa 123, Lima', 'pedro.libra@email.com', '987654321', '987654322'),
(2, 'María', 'Manzaneda', 'Paredes', '77223864', 'F', '1990-08-22', 'Jr. Huancavelica 456, Lima', 'maria.25@email.com', '987654323', '987654324'),
(3, 'Carlos Alberto', 'García', 'Rodríguez', '68964830', 'M', '1978-03-10', 'Av. Brasil 789, Lima', 'carlos.garcia@email.com', '987654325', '987654326'),
(4, 'Ana', 'Barrenechea', 'Vargas', '41842571', 'F', '1995-11-30', 'Calle Los Pinos 234, Lima', 'ana.7u7@email.com', '987654327', '987654328'),
(5, 'Luis Fernando', 'Díaz', 'Silva', '83789012', 'M', '1982-07-18', 'Av. Javier Prado 567, Lima', 'luis.diaz@email.com', '987654329', '987654330'),
(6, 'Patricia Isabel', 'Ruiz', 'Mendoza', '45120123', 'F', '1975-09-25', 'Jr. Cusco 890, Lima', 'patricia.ruiz@email.com', '987654331', '987654332'),
(7, 'Jorge Eduardo', 'Hernández', 'Castro', '77251234', 'M', '1978-12-05', 'Av. La Marina 1234, Lima', 'jorge.hernandez@email.com', '987654333', '987654334'),
(8, 'Sofía', 'Bermudez', 'Rojas', '77325745', 'F', '1993-04-20', 'Calle Las Orquídeas 56, Lima', 'sofia.morales@email.com', '987654335', '987654336'),
(9, 'Ricardo Antonio', 'Flores', 'Salazar', '94387456', 'M', '1970-06-15', 'Av. Angamos 789, Lima', 'ricardo.flores@email.com', '987654337', '987654338'),
(10, 'Carmen', 'Vega', 'Guerrero', '42721304', 'F', '1983-02-28', 'Jr. Ayacucho 345, Lima', 'carmen.vega@email.com', '987654339', '987654340'),
(11, 'Pedro Pablo', 'Castillo', 'Lopez', '11223341', 'M', '1991-10-12', 'Av. Salaverry 678, Lima', 'pedro.castillo@email.com', '987654341', '987654342'),
(12, 'Laura Beatriz', 'Romero', 'Medina', '22334452', 'F', '1987-07-07', 'Calle Los Girasoles 12, Lima', 'laura.romero@email.com', '987654343', '987654344'),
(13, 'Miguel Ángel', 'Sánchez', 'Paredes', '33445563', 'M', '1973-05-22', 'Av. Benavides 3456, Lima', 'miguel.sanchez@email.com', '987654345', '987654346'),
(14, 'Daniela Fernanda', 'Cruz', 'Ortiz', '44556674', 'F', '1994-08-14', 'Jr. Ica 789, Lima', 'daniela.cruz@email.com', '987654347', '987654348'),
(15, 'Oscar Leonardo', 'Gómez', 'Chávez', '55667785', 'M', '1980-11-03', 'Av. Petit Thouars 901, Lima', 'oscar.gomez@email.com', '987654349', '987654350'),
(16, 'Verónica Lucía', 'Mendoza', 'Dávila', '66778896', 'F', '1976-04-17', 'Calle Las Dalias 34, Lima', 'veronica.mendoza@email.com', '987654351', '987654352'),
(17, 'Roberto Carlos', 'Aguilar', 'Campos', '77889907', 'M', '1989-09-09', 'Av. República de Panamá 2345, Lima', 'roberto.aguilar@email.com', '987654353', '987654354'),
(18, 'Claudia Patricia', 'Ríos', 'Valdez', '88990018', 'F', '1992-01-26', 'Jr. Huánuco 567, Lima', 'claudia.rios@email.com', '987654355', '987654356'),
(19, 'Fernando José', 'Delgado', 'Acosta', '99001129', 'M', '1979-07-31', 'Av. Aviación 1489, Lima', 'fernando.delgado@email.com', '987654357', '987654358'),
(20, 'Gabriela Alejandra', 'Paredes', 'León', '00112230', 'F', '1984-12-08', 'Calle Los Jazmines 45, Lima', 'gabriela.paredes@email.com', '987654359', '987654360'),
(21, 'Héctor Luis', 'Córdova', 'Miranda', '10293840', 'M', '1972-03-19', 'Av. Tacna 123, Lima', 'hector.cordova@email.com', '987654361', '987654362'),
(22, 'Silvia Elena', 'Quispe', 'Zapata', '29384750', 'F', '1986-06-24', 'Jr. Junín 456, Lima', 'silvia.quispe@email.com', '987654363', '987654364'),
(23, 'Raúl Antonio', 'Villanueva', 'Suárez', '38475690', 'M', '1997-02-11', 'Av. Grau 789, Lima', 'raul.villanueva@email.com', '987654365', '987654366'),
(24, 'Lucía Margarita', 'Espinoza', 'Luna', '47586931', 'F', '1974-10-05', 'Calle Las Magnolias 67, Lima', 'lucia.espinoza@email.com', '987654367', '987654368'),
(25, 'Arturo Francisco', 'Barrios', 'Reyes', '94389013', 'M', '1981-08-16', 'Av. La Paz 234, Lima', 'arturo.barrios@email.com', '987654369', '987654370'),
(26, 'Elena', 'Carrasco', 'Fuentes', '10890473', 'F', '1996-05-29', 'Jr. Callao 890, Lima', 'elena.carrasco@email.com', '987654371', '987654372'),
(27, 'José', 'Núñez', 'Cabrera', '77223863', 'M', '1977-12-12', 'Av. Canadá 3456, Lima', 'jose.nunez@email.com', '987654373', '987654374'),
(28, 'Mariana Isabel', 'Ponce', 'Vera', '89012865', 'F', '1993-09-03', 'Calle Las Gardenias 78, Lima', 'mariana.ponce@email.com', '987654375', '987654376'),
(29, 'Alberto Javier', 'Salas', 'Moya', '40447047', 'M', '1969-04-27', 'Av. San Martín 901, Lima', 'alberto.salas@email.com', '987654377', '987654378'),
(30, 'Rosa Amelia', 'Tapia', 'Cáceres', '70073074', 'F', '1988-01-14', 'Jr. Trujillo 123, Lima', 'rosa.tapia@email.com', '987654379', '987654380'),
(31, 'Gustavo Adolfo', 'Luna', 'Peña', '12345670', 'M', '1971-07-08', 'Av. Venezuela 456, Lima', 'gustavo.luna@email.com', '987654381', '987654382'),
(32, 'Natalia Carolina', 'Castro', 'Rivas', '23454654', 'F', '1995-10-21', 'Calle Las Azucenas 89, Lima', 'natalia.castro@email.com', '987654383', '987654384'),
(33, 'Felipe Andrés', 'Ramos', 'Soto', '44562190', 'M', '1983-03-16', 'Av. Brasil 789, Lima', 'felipe.ramos@email.com', '987654385', '987654386'),
(34, 'Adriana Lucía', 'Vargas', 'Maldonado', '46438901', 'F', '1979-12-30', 'Jr. Huaraz 234, Lima', 'adriana.vargas@email.com', '987654387', '987654388'),
(35, 'Mario Augusto', 'Jiménez', 'Cisneros', '25478012', 'M', '1990-05-23', 'Av. Javier Prado 567, Lima', 'mario.jimenez@email.com', '987654389', '987654390'),
(36, 'Lourdes Teresa', 'Aliaga', 'Paredes', '67230164', 'F', '1976-08-17', 'Calle Los Lirios 90, Lima', 'lourdes.aliaga@email.com', '987654391', '987654392'),
(37, 'Renato Esteban', 'Cabrera', 'Rosales', '10547234', 'M', '1987-01-04', 'Av. La Marina 1234, Lima', 'renato.cabrera@email.com', '987654393', '987654394'),
(38, 'Diana Patricia', 'Zúñiga', 'Tello', '10470251', 'F', '1994-06-28', 'Jr. Cajamarca 567, Lima', 'diana.zuniga@email.com', '987654395', '987654396'),
(39, 'Hugo Ernesto', 'Mesa', 'Aranda', '43688536', 'M', '1973-11-11', 'Av. Angamos 789, Lima', 'hugo.mesa@email.com', '987654397', '987654398'),
(40, 'Claudia Marcela', 'Valdivia', 'Guerra', '32952215', 'F', '1989-04-05', 'Calle Las Camelias 12, Lima', 'claudia.valdivia@email.com', '987654399', '987654400'),
(41, 'Eduardo Javier', 'Paredes', 'Salinas', '22079535', 'M', '1975-09-18', 'Av. Salaverry 678, Lima', 'eduardo.paredes@email.com', '987654401', '987654402'),
(42, 'Maritza Alejandra', 'Rojas', 'Quiroz', '22334453', 'F', '1991-02-22', 'Jr. Ayacucho 345, Lima', 'maritza.rojas@email.com', '987654403', '987654404'),
(43, 'Santiago Luis', 'Silva', 'Tapia', '33445564', 'M', '1984-07-15', 'Av. Benavides 3456, Lima', 'santiago.silva@email.com', '987654405', '987654406'),
(44, 'Paola Andrea', 'Muñoz', 'López', '44556675', 'F', '1978-12-08', 'Calle Los Claveles 23, Lima', 'paola.munoz@email.com', '987654407', '987654408'),
(45, 'Javier Ignacio', 'Cáceres', 'Vega', '55667786', 'M', '1997-05-31', 'Av. Petit Thouars 901, Lima', 'javier.caceres@email.com', '987654409', '987654410'),
(46, 'Teresa Margarita', 'Dávila', 'Gómez', '66778897', 'F', '1972-10-14', 'Jr. Ica 789, Lima', 'teresa.davila@email.com', '987654411', '987654412'),
(47, 'Alejandro Martín', 'Campos', 'Ríos', '77889908', 'M', '1986-03-27', 'Av. República de Panamá 2345, Lima', 'alejandro.campos@email.com', '987654413', '987654414'),
(48, 'Carmen Rosa', 'Valdez', 'Aguilar', '88990019', 'F', '1993-08-10', 'Calle Las Hortensias 34, Lima', 'carmen.valdez@email.com', '987654415', '987654416'),
(49, 'Luis Alberto', 'Acosta', 'Delgado', '99001120', 'M', '1979-01-23', 'Av. Aviación 419, Lima', 'luis.acosta@email.com', '987654417', '987654418'),
(50, 'Patricia Elena', 'León', 'Paredes', '94557323', 'F', '1985-06-06', 'Jr. Huancavelica 456, Lima', 'patricia.leon@email.com', '987654419', '987654420'),
(51, 'Ricardo Manuel', 'Torres', 'Huamán', '10234567', 'M', '1980-04-12', 'Av. Colonial 890, Lima', 'ricardo.torres@email.com', '987654421', '987654422'),
(52, 'Mónica Isabel', 'Soto', 'Ramos', '20345678', 'F', '1992-07-25', 'Jr. Lampa 123, Lima', 'monica.soto@email.com', '987654423', '987654424'),
(53, 'Daniel Arturo', 'Medina', 'Castillo', '30456789', 'M', '1977-11-08', 'Av. Universitaria 456, Lima', 'daniel.medina@email.com', '987654425', '987654426'),
(54, 'Yolanda Patricia', 'Guerrero', 'Morales', '40567890', 'F', '1985-02-14', 'Calle Los Eucaliptos 67, Lima', 'yolanda.guerrero@email.com', '987654427', '987654428'),
(55, 'Andrés Felipe', 'López', 'Hernández', '50678901', 'M', '1974-09-30', 'Av. Túpac Amaru 789, Lima', 'andres.lopez@email.com', '987654429', '987654430'),
(56, 'Beatriz Elena', 'Medina', 'Vásquez', '60789012', 'F', '1988-12-15', 'Jr. Andahuaylas 234, Lima', 'beatriz.medina@email.com', '987654431', '987654432'),
(57, 'Francisco Javier', 'Chávez', 'Rivera', '70890123', 'M', '1996-05-03', 'Av. El Sol 567, Lima', 'francisco.chavez@email.com', '987654433', '987654434'),
(58, 'Isabella Sofía', 'Dávila', 'Suárez', '80901234', 'F', '1981-08-19', 'Calle Las Begonias 89, Lima', 'isabella.davila@email.com', '987654435', '987654436'),
(59, 'Emilio César', 'Campos', 'Maldonado', '90012345', 'M', '1973-01-07', 'Av. Pershing 901, Lima', 'emilio.campos@email.com', '987654437', '987654438'),
(60, 'Esperanza María', 'Ríos', 'Cisneros', '01234560', 'F', '1990-06-22', 'Jr. Moquegua 345, Lima', 'esperanza.rios@email.com', '987654439', '987654440'),
(61, 'Víctor Hugo', 'Aguilar', 'Peña', '12345601', 'M', '1976-10-11', 'Av. Arequipa 678, Lima', 'victor.aguilar@email.com', '987654441', '987654442'),
(62, 'Rocío Alejandra', 'Valdez', 'Luna', '23456012', 'F', '1987-03-28', 'Calle Los Rosales 12, Lima', 'rocio.valdez@email.com', '987654443', '987654444'),
(63, 'Gonzalo Eduardo', 'Acosta', 'Flores', '34560123', 'M', '1994-12-05', 'Av. Venezuela 1234, Lima', 'gonzalo.acosta@email.com', '987654445', '987654446'),
(64, 'Ximena Lucía', 'Delgado', 'Salazar', '45601234', 'F', '1979-07-16', 'Jr. Cusco 567, Lima', 'ximena.delgado@email.com', '987654447', '987654448'),
(65, 'Raúl Armando', 'Paredes', 'Guerrero', '56012345', 'M', '1982-04-02', 'Av. Angamos 890, Lima', 'raul.paredes@email.com', '987654449', '987654450'),
(66, 'Valeria Cristina', 'León', 'Vega', '60123456', 'F', '1975-11-24', 'Calle Las Violetas 23, Lima', 'valeria.leon@email.com', '987654451', '987654452'),
(67, 'Marcos Antonio', 'Córdova', 'Castro', '70123467', 'M', '1991-09-13', 'Av. La Marina 456, Lima', 'marcos.cordova@email.com', '987654453', '987654454'),
(68, 'Liliana Rosa', 'Quispe', 'Rivas', '80123478', 'F', '1986-01-29', 'Jr. Huánuco 789, Lima', 'liliana.quispe@email.com', '987654455', '987654456'),
(69, 'Sergio Alejandro', 'Villanueva', 'Soto', '90123489', 'M', '1978-06-18', 'Av. Brasil 234, Lima', 'sergio.villanueva@email.com', '987654457', '987654458'),
(70, 'Amparo Isabel', 'Espinoza', 'Maldonado', '01234590', 'F', '1993-10-07', 'Calle Los Tulipanes 45, Lima', 'amparo.espinoza@email.com', '987654459', '987654460'),
(71, 'Rodrigo Luis', 'Barrios', 'Cisneros', '12345671', 'M', '1980-03-21', 'Av. Tacna 678, Lima', 'rodrigo.barrios@email.com', '987654461', '987654462'),
(72, 'Ingrid Patricia', 'Carrasco', 'Peña', '23456782', 'F', '1989-08-04', 'Jr. Junín 901, Lima', 'ingrid.carrasco@email.com', '987654463', '987654464'),
(73, 'Óscar Rubén', 'Núñez', 'Luna', '34567893', 'M', '1972-12-17', 'Av. Grau 345, Lima', 'oscar.nunez@email.com', '987654465', '987654466'),
(74, 'Fiorella Andrea', 'Ponce', 'Flores', '45678904', 'F', '1995-05-30', 'Calle Las Margaritas 67, Lima', 'fiorella.ponce@email.com', '987654467', '987654468'),
(75, 'Enrique Manuel', 'Salas', 'Salazar', '56789015', 'M', '1977-02-26', 'Av. La Paz 890, Lima', 'enrique.salas@email.com', '987654469', '987654470'),
(76, 'Gladys Elena', 'Tapia', 'Guerrero', '67890126', 'F', '1984-09-09', 'Jr. Callao 123, Lima', 'gladys.tapia@email.com', '987654471', '987654472'),
(77, 'Iván Alberto', 'Luna', 'Vega', '78901237', 'M', '1971-04-15', 'Av. Canadá 456, Lima', 'ivan.luna@email.com', '987654473', '987654474'),
(78, 'Pilar Mercedes', 'Castro', 'Castro', '89012348', 'F', '1988-11-28', 'Calle Las Gardenias 78, Lima', 'pilar.castro@email.com', '987654475', '987654476'),
(79, 'Manuel Jesús', 'Ramos', 'Rivas', '90123459', 'M', '1996-07-11', 'Av. San Martín 234, Lima', 'manuel.ramos@email.com', '987654477', '987654478'),
(80, 'Nilda Esperanza', 'Vargas', 'Soto', '01234562', 'F', '1983-01-24', 'Jr. Trujillo 567, Lima', 'nilda.vargas@email.com', '987654479', '987654480'),
(81, 'Álvaro José', 'Jiménez', 'Maldonado', '12345612', 'M', '1979-08-07', 'Av. Venezuela 890, Lima', 'alvaro.jimenez@email.com', '987654481', '987654482'),
(82, 'Milagros Rosa', 'Aliaga', 'Cisneros', '23456723', 'F', '1992-03-20', 'Calle Las Azucenas 12, Lima', 'milagros.aliaga@email.com', '987654483', '987654484'),
(83, 'Cristian David', 'Cabrera', 'Peña', '34567834', 'M', '1974-10-03', 'Av. Brasil 345, Lima', 'cristian.cabrera@email.com', '987654485', '987654486'),
(84, 'Susana Patricia', 'Zúñiga', 'Luna', '45678945', 'F', '1987-05-16', 'Jr. Huaraz 678, Lima', 'susana.zuniga@email.com', '987654487', '987654488'),
(85, 'Pablo Ernesto', 'Mesa', 'Flores', '56789056', 'M', '1981-12-29', 'Av. Javier Prado 901, Lima', 'pablo.mesa@email.com', '987654489', '987654490'),
(86, 'Karina Lucía', 'Valdivia', 'Salazar', '67890167', 'F', '1976-07-12', 'Calle Los Lirios 23, Lima', 'karina.valdivia@email.com', '987654491', '987654492'),
(87, 'Armando Luis', 'Paredes', 'Guerrero', '78901278', 'M', '1990-02-25', 'Av. La Marina 456, Lima', 'armando.paredes@email.com', '987654493', '987654494'),
(88, 'Tatiana Isabel', 'Rojas', 'Vega', '89012389', 'F', '1985-09-08', 'Jr. Ayacucho 789, Lima', 'tatiana.rojas@email.com', '987654495', '987654496'),
(89, 'Guillermo César', 'Silva', 'Castro', '90123490', 'M', '1973-04-21', 'Av. Benavides 234, Lima', 'guillermo.silva@email.com', '987654497', '987654498'),
(90, 'Lorena Andrea', 'Muñoz', 'Rivas', '01234501', 'F', '1994-11-04', 'Calle Los Claveles 56, Lima', 'lorena.munoz@email.com', '987654499', '987654500'),
(91, 'Germán Arturo', 'Cáceres', 'Soto', '12345602', 'M', '1978-06-17', 'Av. Petit Thouars 789, Lima', 'german.caceres@email.com', '987654501', '987654502'),
(92, 'Violeta María', 'Dávila', 'Maldonado', '23456703', 'F', '1991-01-30', 'Jr. Ica 123, Lima', 'violeta.davila@email.com', '987654503', '987654504'),
(93, 'Patricio Miguel', 'Campos', 'Cisneros', '34567804', 'M', '1982-08-13', 'Av. República de Panamá 456, Lima', 'patricio.campos@email.com', '987654505', '987654506'),
(94, 'Magdalena Rosa', 'Valdez', 'Peña', '45678905', 'F', '1975-03-26', 'Calle Las Hortensias 67, Lima', 'magdalena.valdez@email.com', '987654507', '987654508'),
(95, 'Hernán Eduardo', 'Acosta', 'Luna', '56789006', 'M', '1989-10-09', 'Av. Aviación 890, Lima', 'hernan.acosta@email.com', '987654509', '987654510'),
(96, 'Alicia Patricia', 'León', 'Flores', '67890107', 'F', '1986-05-22', 'Jr. Huancavelica 234, Lima', 'alicia.leon@email.com', '987654511', '987654512'),
(97, 'Benjamín Carlos', 'Torres', 'Salazar', '78901208', 'M', '1972-12-05', 'Av. Colonial 567, Lima', 'benjamin.torres@email.com', '987654513', '987654514'),
(98, 'Cecilia Elena', 'Soto', 'Guerrero', '89012309', 'F', '1997-07-18', 'Jr. Lampa 890, Lima', 'cecilia.soto@email.com', '987654515', '987654516'),
(99, 'Aurelio Francisco', 'Medina', 'Vega', '90123410', 'M', '1980-02-01', 'Av. Universitaria 123, Lima', 'aurelio.medina@email.com', '987654517', '987654518'),
(100, 'Estrella Beatriz', 'Guerrero', 'Castro', '01234511', 'F', '1993-09-14', 'Calle Los Eucaliptos 45, Lima', 'estrella.guerrero@email.com', '987654519', '987654520');

-- DATOS PARA LA TABLA TIPO_RELACION

INSERT INTO tipo_relacion (id_tipo_relacion, nombre, descripcion) VALUES
(1, 'Padre/Madre-Hijo/a', 'Relación entre un padre o madre y su hijo/a, generalmente para gestionar historiales clínicos de menores.'),
(2, 'Cónyuge', 'Relación entre esposos/as, permite acceso mutuo a historiales clínicos por razones familiares.'),
(3, 'Tutor Legal', 'Relación donde una persona es designada legalmente para gestionar el historial clínico de otra.'),
(4, 'Hermano/a', 'Relación entre hermanos/as, permite acceso a historiales clínicos en casos de apoyo familiar.'),
(5, 'Apoderado', 'Relación donde una persona es autorizada para gestionar el historial clínico de otra, sin vínculo familiar.');


--  DATOS PARA LA TABLA RELACION_PERSONAS

INSERT INTO relacion_personas (id_persona_1, id_persona_2, id_tipo_relacion, fecha_asignacion, fecha_expiracion, observaciones) VALUES
(1, 11, 1, '2024-01-15', NULL, 'Pedro Domínguez gestiona el historial clínico de su hijo Pedro Pablo Castillo.'),
(2, 8, 2, '2024-03-20', NULL, 'María Manzaneda y Sofía Bermudez, cónyuges, comparten acceso a historiales clínicos.'),
(3, 13, 4, '2024-06-10', NULL, 'Carlos Alberto García y Miguel Ángel Sánchez, hermanos, comparten acceso por apoyo familiar.'),
(6, 16, 4, '2024-02-28', NULL, 'Patricia Isabel Ruiz y Verónica Lucía Mendoza, hermanas, gestionan historiales mutuamente.'),
(9, 29, 3, '2024-07-01', '2026-07-01', 'Ricardo Antonio Flores es tutor legal de Alberto Javier Salas por incapacidad temporal.'),
(10, 20, 2, '2024-04-15', NULL, 'Carmen Vega y Gabriela Alejandra Paredes, cónyuges, comparten acceso a historiales clínicos.'),
(15, 59, 1, '2024-05-30', NULL, 'Oscar Leonardo Gómez gestiona el historial clínico de su hijo Emilio César Campos.'),
(24, 64, 4, '2024-08-12', NULL, 'Lucía Margarita Espinoza y Ximena Lucía Delgado, hermanas, comparten acceso por apoyo familiar.'),
(29, 49, 5, '2024-09-01', '2025-09-01', 'Alberto Javier Salas es apoderado de Luis Alberto Acosta para gestionar su historial clínico.'),
(41, 87, 1, '2024-10-20', NULL, 'Eduardo Javier Paredes gestiona el historial clínico de su hijo Armando Luis Paredes.');



-- DATOS PARA LA TABLA ESPECIALIDAD

INSERT INTO especialidad (id_especialidad, descripcion, area_asignada, nivel_experiencia) VALUES
(1, 'Medicina General', 'Consultorio Externo', 'Intermedio'),
(2, 'Pediatría', 'Pediatría', 'Avanzado'),
(3, 'Ginecología y Obstetricia', 'Gineco-Obstetricia', 'Avanzado'),
(4, 'Cardiología', 'Cardiología', 'Avanzado'),
(5, 'Dermatología', 'Dermatología', 'Intermedio'),
(6, 'Neurología', 'Neurología', 'Avanzado'),
(7, 'Endocrinología', 'Endocrinología', 'Avanzado'),
(8, 'Psiquiatría', 'Salud Mental', 'Intermedio'),
(9, 'Traumatología', 'Emergencias', 'Avanzado'),
(10, 'Oftalmología', 'Oftalmología', 'Intermedio'),
(11, 'Otorrinolaringología', 'Especialidades Médicas', 'Intermedio'),
(12, 'Urología', 'Urología', 'Avanzado'),
(13, 'Nefrología', 'Nefrología', 'Avanzado'),
(14, 'Gastroenterología', 'Gastroenterología', 'Avanzado'),
(15, 'Oncología', 'Oncología', 'Avanzado'),
(16, 'Hematología', 'Laboratorio Clínico', 'Intermedio'),
(17, 'Alergología', 'Consultorio Externo', 'Intermedio'),
(18, 'Neonatología', 'Neonatología', 'Avanzado'),
(19, 'Medicina Interna', 'Hospitalización', 'Avanzado'),
(20, 'Infectología', 'Infectología', 'Avanzado'),
(21, 'Anestesiología', 'Quirófano', 'Avanzado'),
(22, 'Radiología', 'Imagenología', 'Intermedio'),
(23, 'Medicina del Deporte', 'Rehabilitación', 'Intermedio'),
(24, 'Medicina Ocupacional', 'Salud Ocupacional', 'Intermedio'),
(25, 'Medicina Familiar', 'Consultorio Externo', 'Intermedio'),
(26, 'Cirugía General', 'Quirófano', 'Avanzado'),
(27, 'Cirugía Plástica', 'Quirófano', 'Avanzado'),
(28, 'Cirugía Cardiovascular', 'Quirófano', 'Avanzado'),
(29, 'Cirugía Ortopédica', 'Traumatología', 'Avanzado'),
(30, 'Patología Clínica', 'Laboratorio Clínico', 'Intermedio'),
(31, 'Odontología General', 'Odontología', 'Intermedio'),
(32, 'Ortodoncia', 'Odontología', 'Avanzado'),
(33, 'Endodoncia', 'Odontología', 'Avanzado'),
(34, 'Periodoncia', 'Odontología', 'Avanzado'),
(35, 'Odontopediatría', 'Odontología', 'Intermedio'),
(36, 'Psicología Clínica', 'Salud Mental', 'Intermedio'),
(37, 'Nutrición Clínica', 'Nutrición', 'Intermedio'),
(38, 'Terapia Física', 'Rehabilitación', 'Intermedio'),
(39, 'Terapia Respiratoria', 'Unidad de Cuidados Respiratorios', 'Intermedio'),
(40, 'Terapia Ocupacional', 'Rehabilitación', 'Intermedio'),
(41, 'Fonoaudiología', 'Terapias del Lenguaje', 'Intermedio'),
(42, 'Enfermería General', 'Enfermería', 'Intermedio'),
(43, 'Enfermería Pediátrica', 'Pediatría', 'Intermedio'),
(44, 'Bioquímica Clínica', 'Laboratorio Clínico', 'Avanzado'),
(45, 'Epidemiología', 'Salud Pública', 'Avanzado'),
(46, 'Salud Pública', 'Salud Pública', 'Avanzado'),
(47, 'Genética Médica', 'Laboratorio Clínico', 'Avanzado'),
(48, 'Geriatría', 'Medicina Interna', 'Avanzado'),
(49, 'Reumatología', 'Especialidades Médicas', 'Avanzado'),
(50, 'Medicina Estética', 'Consultorio Estético', 'Intermedio');


-- DATOS PARA LA TABLA PERSONAL_MEDICO

INSERT INTO personal_medico (id_personal_medico, id_persona, id_especialidad, licencia_medica, colegiatura, habilitado, institucion_asociada) VALUES
(1, 51, 1, 'LIC-MG-2023-001', 'CMP-45001', true, 'Hospital Nacional Dos de Mayo'),
(2, 52, 2, 'LIC-PED-2023-002', 'CMP-45002', true, 'Instituto Nacional de Salud del Niño'),
(3, 53, 3, 'LIC-GO-2023-003', 'CMP-45003', true, 'Hospital Nacional Edgardo Rebagliati'),
(4, 54, 4, 'LIC-CAR-2023-004', 'CMP-45004', true, 'Instituto Nacional Cardiovascular'),
(5, 55, 5, 'LIC-DER-2023-005', 'CMP-45005', true, 'Hospital Nacional Guillermo Almenara'),
(6, 56, 6, 'LIC-NEU-2023-006', 'CMP-45006', true, 'Instituto Nacional de Neurología'),
(7, 57, 7, 'LIC-END-2023-007', 'CMP-45007', true, 'Hospital Nacional Edgardo Rebagliati'),
(8, 58, 8, 'LIC-PSI-2023-008', 'CMP-45008', true, 'Instituto Nacional de Salud Mental'),
(9, 59, 9, 'LIC-TRA-2023-009', 'CMP-45009', true, 'Hospital Nacional Dos de Mayo'),
(10, 60, 10, 'LIC-OFT-2023-010', 'CMP-45010', true, 'Instituto Nacional de Oftalmología'),
(11, 61, 11, 'LIC-ORL-2023-011', 'CMP-45011', true, 'Hospital Nacional Guillermo Almenara'),
(12, 62, 12, 'LIC-URO-2023-012', 'CMP-45012', true, 'Hospital Nacional Edgardo Rebagliati'),
(13, 63, 13, 'LIC-NEF-2023-013', 'CMP-45013', true, 'Hospital Nacional Guillermo Almenara'),
(14, 64, 14, 'LIC-GAS-2023-014', 'CMP-45014', true, 'Hospital Nacional Edgardo Rebagliati'),
(15, 65, 15, 'LIC-ONC-2023-015', 'CMP-45015', true, 'Instituto Nacional de Enfermedades Neoplásicas'),
(16, 66, 16, 'LIC-HEM-2023-016', 'CMP-45016', true, 'Hospital Nacional Guillermo Almenara'),
(17, 67, 17, 'LIC-ALE-2023-017', 'CMP-45017', true, 'Hospital Nacional Dos de Mayo'),
(18, 68, 18, 'LIC-NEO-2023-018', 'CMP-45018', true, 'Instituto Nacional Materno Perinatal'),
(19, 69, 19, 'LIC-MI-2023-019', 'CMP-45019', true, 'Hospital Nacional Edgardo Rebagliati'),
(20, 70, 20, 'LIC-INF-2023-020', 'CMP-45020', true, 'Hospital Nacional Dos de Mayo'),
(21, 71, 21, 'LIC-ANE-2023-021', 'CMP-45021', true, 'Hospital Nacional Guillermo Almenara'),
(22, 72, 22, 'LIC-RAD-2023-022', 'CMP-45022', true, 'Hospital Nacional Edgardo Rebagliati'),
(23, 73, 23, 'LIC-MD-2023-023', 'CMP-45023', true, 'Centro Nacional de Medicina del Deporte'),
(24, 74, 24, 'LIC-MO-2023-024', 'CMP-45024', true, 'Centro Nacional de Salud Ocupacional'),
(25, 75, 25, 'LIC-MF-2023-025', 'CMP-45025', true, 'Hospital Nacional Dos de Mayo'),
(26, 76, 26, 'LIC-CG-2023-026', 'CMP-45026', true, 'Hospital Nacional Guillermo Almenara'),
(27, 77, 27, 'LIC-CP-2023-027', 'CMP-45027', true, 'Clínica San Felipe'),
(28, 78, 28, 'LIC-CC-2023-028', 'CMP-45028', true, 'Instituto Nacional Cardiovascular'),
(29, 79, 29, 'LIC-CO-2023-029', 'CMP-45029', true, 'Hospital Nacional Guillermo Almenara'),
(30, 80, 30, 'LIC-PC-2023-030', 'CMP-45030', true, 'Hospital Nacional Edgardo Rebagliati');


-- DATOS PARA LA TABLA TURNO

INSERT INTO turno (id_personal_medico, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '08:00:00', '16:00:00'),
(1, 2, '08:00:00', '16:00:00'),
(1, 3, '08:00:00', '16:00:00'),
(1, 4, '08:00:00', '16:00:00'),
(1, 5, '08:00:00', '14:00:00'),
(2, 1, '07:00:00', '15:00:00'),
(2, 3, '07:00:00', '19:00:00'),
(2, 6, '08:00:00', '20:00:00'),
(3, 2, '14:00:00', '22:00:00'),
(3, 4, '14:00:00', '22:00:00'),
(3, 6, '20:00:00', '08:00:00'),
(4, 1, '08:00:00', '16:00:00'),
(4, 3, '08:00:00', '16:00:00'),
(4, 5, '08:00:00', '16:00:00'),
(5, 2, '09:00:00', '17:00:00'),
(5, 4, '09:00:00', '17:00:00'),
(6, 1, '08:00:00', '18:00:00'),
(6, 3, '08:00:00', '18:00:00'),
(6, 5, '08:00:00', '14:00:00'),
(7, 2, '08:00:00', '16:00:00'),
(7, 4, '08:00:00', '16:00:00'),
(8, 3, '10:00:00', '18:00:00'),
(8, 5, '10:00:00', '18:00:00'),
(8, 6, '08:00:00', '14:00:00'),
(9, 1, '07:00:00', '15:00:00'),
(9, 2, '07:00:00', '15:00:00'),
(9, 4, '07:00:00', '15:00:00'),
(10, 3, '09:00:00', '17:00:00'),
(10, 5, '09:00:00', '17:00:00'),
(11, 2, '08:00:00', '14:00:00'),
(11, 4, '08:00:00', '14:00:00'),
(12, 1, '14:00:00', '22:00:00'),
(12, 3, '14:00:00', '22:00:00'),
(12, 5, '08:00:00', '14:00:00'),
(13, 2, '08:00:00', '18:00:00'),
(13, 4, '08:00:00', '18:00:00'),
(14, 1, '07:00:00', '15:00:00'),
(14, 3, '07:00:00', '15:00:00'),
(14, 5, '07:00:00', '15:00:00'),
(15, 2, '09:00:00', '17:00:00'),
(15, 4, '09:00:00', '17:00:00'),
(15, 6, '08:00:00', '14:00:00'),
(16, 1, '08:00:00', '16:00:00'),
(16, 3, '08:00:00', '16:00:00'),
(16, 5, '08:00:00', '14:00:00'),
(17, 2, '10:00:00', '18:00:00'),
(17, 4, '10:00:00', '18:00:00'),
(18, 3, '20:00:00', '08:00:00'),
(18, 5, '20:00:00', '08:00:00'),
(19, 1, '08:00:00', '18:00:00'),
(19, 2, '08:00:00', '18:00:00'),
(19, 4, '08:00:00', '18:00:00'),
(20, 3, '09:00:00', '17:00:00'),
(20, 5, '09:00:00', '17:00:00'),
(21, 1, '06:00:00', '14:00:00'),
(21, 3, '06:00:00', '14:00:00'),
(21, 6, '20:00:00', '08:00:00'),
(22, 2, '08:00:00', '20:00:00'),
(22, 4, '08:00:00', '20:00:00'),
(23, 1, '10:00:00', '18:00:00'),
(23, 3, '10:00:00', '18:00:00'),
(24, 2, '08:00:00', '16:00:00'),
(24, 4, '08:00:00', '16:00:00'),
(25, 1, '08:00:00', '14:00:00'),
(25, 3, '08:00:00', '14:00:00'),
(25, 5, '08:00:00', '14:00:00'),
(26, 2, '07:00:00', '19:00:00'),
(26, 4, '07:00:00', '19:00:00'),
(26, 6, '08:00:00', '20:00:00'),
(27, 3, '09:00:00', '17:00:00'),
(27, 5, '09:00:00', '17:00:00'),
(28, 2, '07:00:00', '19:00:00'),
(28, 4, '07:00:00', '19:00:00'),
(29, 1, '08:00:00', '16:00:00'),
(29, 3, '08:00:00', '16:00:00'),
(29, 5, '08:00:00', '16:00:00'),
(30, 2, '10:00:00', '18:00:00'),
(30, 4, '10:00:00', '18:00:00'),
(30, 6, '08:00:00', '14:00:00');


--  DATOS PARA LA TABLA ADMINISTRADOR

INSERT INTO administrador (id_administrador, id_persona, cargo, nivel_acceso) VALUES
(1, 5, 'Administrador Principal', 'Nivel 5 - Acceso Total'),
(2, 12, 'Coordinador de Sistemas', 'Nivel 4 - Acceso Alto'),
(3, 18, 'Supervisor de Plataforma', 'Nivel 4 - Acceso Alto'),
(4, 23, 'Administrador de Base de Datos', 'Nivel 3 - Acceso Medio'),
(5, 27, 'Analista de Sistemas', 'Nivel 3 - Acceso Medio'),
(6, 32, 'Técnico de Soporte', 'Nivel 2 - Acceso Básico'),
(7, 38, 'Asistente Administrativo', 'Nivel 2 - Acceso Básico'),
(8, 42, 'Auditor de Sistemas', 'Nivel 3 - Acceso Medio'),
(9, 45, 'Coordinador de Seguridad', 'Nivel 4 - Acceso Alto'),
(10, 49, 'Director de TI', 'Nivel 5 - Acceso Total'),
(11, 81, 'Director General', 'Nivel 1 - Administrador Total'),
(12, 82, 'Subdirector Médico', 'Nivel 2 - Administrador Avanzado'),
(13, 83, 'Jefe de Recursos Humanos', 'Nivel 3 - Administrador Intermedio'),
(14, 84, 'Coordinador de Sistemas', 'Nivel 2 - Administrador Avanzado'),
(15, 85, 'Jefe de Finanzas', 'Nivel 2 - Administrador Avanzado'),
(16, 86, 'Coordinador de Calidad', 'Nivel 3 - Administrador Intermedio'),
(17, 87, 'Jefe de Enfermería', 'Nivel 3 - Administrador Intermedio'),
(18, 88, 'Coordinador de Logística', 'Nivel 3 - Administrador Intermedio'),
(19, 89, 'Jefe de Admisión', 'Nivel 3 - Administrador Intermedio'),
(20, 90, 'Coordinador de Emergencias', 'Nivel 2 - Administrador Avanzado'),
(21, 91, 'Jefe de Mantenimiento', 'Nivel 4 - Administrador Básico'),
(22, 92, 'Coordinador de Archivo', 'Nivel 4 - Administrador Básico'),
(23, 93, 'Supervisor de Seguridad', 'Nivel 4 - Administrador Básico'),
(24, 94, 'Coordinador de Limpieza', 'Nivel 4 - Administrador Básico'),
(25, 95, 'Jefe de Comunicaciones', 'Nivel 3 - Administrador Intermedio'),
(26, 96, 'Coordinador de Capacitación', 'Nivel 3 - Administrador Intermedio'),
(27, 97, 'Supervisor de Turnos', 'Nivel 4 - Administrador Básico'),
(28, 98, 'Coordinador de Farmacia', 'Nivel 3 - Administrador Intermedio'),
(29, 99, 'Jefe de Estadística', 'Nivel 3 - Administrador Intermedio'),
(30, 100, 'Coordinador de Bienestar', 'Nivel 4 - Administrador Básico');

--  DATOS PARA LA TABLA ROL

INSERT INTO rol (id_rol, nombre, descripcion) VALUES
(1, 'Paciente', 'Usuario que recibe atención médica'),
(2, 'Asistente Administrativo', 'Personal de apoyo administrativo'),
(3, 'Personal Médico', 'Profesionales de la salud'),
(4, 'Jefe de Servicio Médico', 'Responsable de área médica');


--  DATOS PARA LA TABLA ASIGNACION_ROL

INSERT INTO asignacion_rol (id_asignacion_rol, id_persona, id_rol, fecha_asignacion, fecha_expiracion) VALUES
(1, 23, 1, '2025-01-05', NULL),
(2, 12, 3, '2025-01-06', NULL),
(3, 45, 2, '2025-01-07', '2025-01-08'),
(4, 7, 1, '2025-01-08', NULL),
(5, 38, 4, '2025-01-09', NULL),
(6, 19, 3, '2025-01-10', '2025-01-13'),
(7, 2, 1, '2025-01-11', NULL),
(8, 31, 3, '2025-01-12', NULL),
(9, 50, 1, '2025-01-13', NULL),
(10, 15, 2, '2025-01-14', '2025-07-15'),
(11, 27, 3, '2025-01-15', NULL),
(12, 8, 1, '2025-01-16', NULL),
(13, 42, 4, '2025-01-17', NULL),
(14, 3, 3, '2025-01-18', '2025-12-20'),
(15, 36, 1, '2025-01-19', NULL),
(16, 21, 3, '2025-01-20', NULL),
(17, 49, 1, '2025-01-21', NULL),
(18, 14, 2, '2025-01-22', '2025-10-24'),
(19, 5, 3, '2025-01-23', NULL),
(20, 30, 1, '2025-01-24', NULL),
(21, 17, 4, '2025-01-25', NULL),
(22, 44, 3, '2025-01-26', '2025-01-28'),
(23, 9, 1, '2025-01-27', NULL),
(24, 26, 3, '2025-01-28', NULL),
(25, 1, 1, '2025-01-29', NULL),
(26, 39, 2, '2025-01-30', '2025-08-31'),
(27, 18, 3, '2025-01-31', NULL),
(28, 47, 1, '2025-02-01', NULL),
(29, 10, 3, '2025-02-02', '2025-02-02'),
(30, 33, 1, '2025-02-03', NULL),
(31, 22, 4, '2025-02-04', NULL),
(32, 6, 3, '2025-02-05', NULL),
(33, 41, 1, '2025-02-06', NULL),
(34, 29, 3, '2025-02-07', '2025-11-07'),
(35, 4, 1, '2025-02-08', NULL),
(36, 37, 3, '2025-02-09', NULL),
(37, 16, 1, '2025-02-10', NULL),
(38, 48, 2, '2025-02-11', '2025-09-12'),
(39, 25, 3, '2025-02-12', NULL),
(40, 11, 1, '2025-02-13', NULL),
(41, 34, 4, '2025-02-14', NULL),
(42, 20, 3, '2025-02-15', '2025-02-20'),
(43, 43, 1, '2025-02-16', NULL),
(44, 13, 3, '2025-02-17', NULL),
(45, 46, 1, '2025-02-18', NULL),
(46, 28, 2, '2025-02-19', '2025-12-26'),
(47, 35, 3, '2025-02-20', NULL),
(48, 24, 1, '2025-02-21', NULL),
(49, 40, 3, '2025-02-22', NULL),
(50, 32, 1, '2025-02-23', NULL);


-- DATOS PARA LA TABLA ALERGIA

INSERT INTO alergia (id_alergia, nombre_alergia, componente_alergeno) VALUES
(1, 'Penicilina', 'Reacción anafiláctica'),
(2, 'Aspirina', 'Urticaria severa'),
(3, 'Mariscos', 'Shock anafiláctico'),
(4, 'Maní', 'Alergia alimentaria severa'),
(5, 'Lácteos', 'Intolerancia alimentaria'),
(6, 'Látex', 'Irritación dérmica'),
(7, 'Polvo', 'Rinitis alérgica'),
(8, 'Pólenes', 'Estornudos frecuentes'),
(9, 'Huevo', 'Dermatitis por alimentos'),
(10, 'Picadura de abeja', 'Inflamación intensa'),
(11, 'Chocolate', 'Urticaria leve'),
(12, 'Fresa', 'Dermatitis alimentaria'),
(13, 'Gluten', 'Alergia no celíaca'),
(14, 'Soja', 'Distensión abdominal'),
(15, 'Cloro', 'Irritación en piel y ojos'),
(16, 'Níquel', 'Alergia por contacto'),
(17, 'Gatos', 'Asma inducida'),
(18, 'Perros', 'Rinitis por exposición'),
(19, 'Penicilamina', 'Eritema multiforme'),
(20, 'Sulfamidas', 'Reacción cutánea'),
(21, 'Ibuprofeno', 'Broncoespasmo'),
(22, 'Colorantes artificiales', 'Hipersensibilidad'),
(23, 'Conservantes', 'Dolor abdominal'),
(24, 'Detergentes', 'Reacción cutánea'),
(25, 'Insecticidas', 'Dermatitis química'),
(26, 'Alcohol', 'Rubor facial'),
(27, 'Café', 'Taquicardia alérgica'),
(28, 'Paracetamol', 'Urticaria'),
(29, 'Antibióticos betalactámicos', 'Anafilaxia'),
(30, 'Camarones', 'Edema de labios'),
(31, 'Pescado', 'Náuseas y vómitos'),
(32, 'Pimienta', 'Reacción oral'),
(33, 'Cilantro', 'Picazón en la lengua'),
(34, 'Ajo', 'Hinchazón oral'),
(35, 'Cebolla', 'Ojos llorosos y estornudos'),
(36, 'Lavanda', 'Dolor de cabeza'),
(37, 'Perfumes', 'Broncoespasmo'),
(38, 'Maíz', 'Reacción gastrointestinal'),
(39, 'Trigo', 'Hipersensibilidad no celíaca'),
(40, 'Cítricos', 'Reacción oral'),
(41, 'Melón', 'Síndrome de alergia oral'),
(42, 'Nueces', 'Anafilaxia alimentaria'),
(43, 'Girasol', 'Dermatitis de contacto'),
(44, 'Gelatina', 'Hinchazón leve'),
(45, 'Vacunas', 'Reacción postvacunal'),
(46, 'Yodo', 'Reacción cutánea'),
(47, 'Contrastantes radiológicos', 'Anafilaxia severa'),
(48, 'Teofilina', 'Palpitaciones'),
(49, 'Clindamicina', 'Diarrea alérgica'),
(50, 'Metamizol', 'Erupción dérmica');


-- DATOS PARA LA TABLA PERFIL_MEDICO

INSERT INTO perfil_medico (id_perfil_medico, fecha_atencion, grupo_sanguineo, ambiente_residencia, orientacion_sexual, vida_sexual_activa) VALUES
(1, '2024-01-15 08:30:00', 'O+', 'Urbano', 'Heterosexual', TRUE),
(2, '2024-02-20 10:45:00', 'A+', 'Rural', 'Homosexual', FALSE),
(3, '2024-03-05 09:10:00', 'B-', 'Suburbano', 'Bisexual', TRUE),
(4, '2024-01-30 11:25:00', 'AB+', 'Urbano', 'Heterosexual', TRUE),
(5, '2024-04-12 14:00:00', 'O-', 'Rural', 'Asexual', FALSE),
(6, '2024-05-22 13:45:00', 'A-', 'Urbano', 'Heterosexual', TRUE),
(7, '2024-06-10 08:15:00', 'B+', 'Rural', 'Pansexual', TRUE),
(8, '2024-07-19 16:30:00', 'AB-', 'Suburbano', 'Heterosexual', FALSE),
(9, '2024-08-03 09:00:00', 'O+', 'Urbano marginal', 'Heterosexual', TRUE),
(10, '2024-08-18 12:20:00', 'A+', 'Rural disperso', 'Homosexual', FALSE),
(11, '2024-09-09 10:00:00', 'B-', 'Urbano', 'Heterosexual', TRUE),
(12, '2024-10-01 15:10:00', 'AB+', 'Suburbano', 'Bisexual', TRUE),
(13, '2024-10-15 09:30:00', 'O-', 'Rural', 'Asexual', FALSE),
(14, '2024-11-05 13:00:00', 'A-', 'Urbano', 'Heterosexual', TRUE),
(15, '2024-11-20 14:45:00', 'B+', 'Suburbano', 'Pansexual', TRUE),
(16, '2024-12-03 10:10:00', 'AB-', 'Rural', 'Homosexual', FALSE),
(17, '2024-12-17 11:50:00', 'O+', 'Urbano', 'Heterosexual', TRUE),
(18, '2025-01-08 08:00:00', 'A+', 'Rural', 'Bisexual', TRUE),
(19, '2025-01-23 13:20:00', 'B-', 'Urbano marginal', 'Heterosexual', FALSE),
(20, '2025-02-10 09:40:00', 'AB+', 'Rural disperso', 'Asexual', FALSE),
(21, '2025-02-25 10:30:00', 'O-', 'Suburbano', 'Pansexual', TRUE),
(22, '2025-03-12 14:10:00', 'A-', 'Urbano', 'Heterosexual', TRUE),
(23, '2025-03-28 11:15:00', 'B+', 'Rural', 'Homosexual', FALSE),
(24, '2025-04-09 09:25:00', 'AB-', 'Suburbano', 'Heterosexual', TRUE),
(25, '2025-04-21 15:00:00', 'O+', 'Urbano marginal', 'Heterosexual', TRUE),
(26, '2025-05-05 08:45:00', 'A+', 'Rural disperso', 'Bisexual', TRUE),
(27, '2025-05-19 10:50:00', 'B-', 'Urbano', 'Pansexual', TRUE),
(28, '2025-06-03 13:30:00', 'AB+', 'Suburbano', 'Heterosexual', TRUE),
(29, '2025-06-17 09:10:00', 'O-', 'Rural', 'Asexual', FALSE),
(30, '2025-07-01 08:00:00', 'A-', 'Urbano', 'Homosexual', FALSE),
(31, '2025-07-15 14:00:00', 'B+', 'Suburbano', 'Bisexual', TRUE),
(32, '2025-07-30 10:20:00', 'AB-', 'Rural', 'Heterosexual', TRUE),
(33, '2025-08-12 11:10:00', 'O+', 'Urbano marginal', 'Pansexual', TRUE),
(34, '2025-08-27 12:40:00', 'A+', 'Rural disperso', 'Heterosexual', TRUE),
(35, '2025-09-11 09:50:00', 'B-', 'Suburbano', 'Asexual', FALSE),
(36, '2025-09-26 15:30:00', 'AB+', 'Urbano', 'Heterosexual', TRUE),
(37, '2025-10-10 08:20:00', 'O-', 'Rural', 'Homosexual', FALSE),
(38, '2025-10-24 14:45:00', 'A-', 'Suburbano', 'Heterosexual', TRUE),
(39, '2025-11-07 09:15:00', 'B+', 'Urbano marginal', 'Bisexual', TRUE),
(40, '2025-11-21 13:40:00', 'AB-', 'Rural disperso', 'Pansexual', TRUE),
(41, '2025-12-05 10:00:00', 'O+', 'Urbano', 'Asexual', FALSE),
(42, '2025-12-19 11:30:00', 'A+', 'Suburbano', 'Heterosexual', TRUE),
(43, '2026-01-02 08:10:00', 'B-', 'Rural', 'Homosexual', FALSE),
(44, '2026-01-16 15:20:00', 'AB+', 'Urbano', 'Pansexual', TRUE),
(45, '2026-01-30 10:35:00', 'O-', 'Suburbano', 'Heterosexual', TRUE),
(46, '2026-02-13 09:00:00', 'A-', 'Rural', 'Bisexual', TRUE),
(47, '2026-02-27 14:25:00', 'B+', 'Urbano marginal', 'Heterosexual', TRUE),
(48, '2026-03-13 08:50:00', 'AB-', 'Rural disperso', 'Asexual', FALSE),
(49, '2026-03-27 11:45:00', 'O+', 'Suburbano', 'Homosexual', FALSE),
(50, '2026-04-10 13:15:00', 'A+', 'Urbano', 'Heterosexual', TRUE);


-- DATOS PARA LA TABLA PERFIL_ALERGIAS

INSERT INTO perfil_alergias (id_perfil_alergias, id_perfil_medico, id_alergia) VALUES
(1, 1, 1),
(2, 2, 4),
(3, 3, 5),
(4, 4, 2),
(5, 5, 7),
(6, 6, 20),
(7, 7, 13),
(8, 8, 28),
(9, 9, 3),
(10, 10, 6),
(11, 11, 15),
(12, 12, 10),
(13, 13, 29),
(14, 14, 14),
(15, 15, 42),
(16, 16, 30),
(17, 17, 1),
(18, 18, 5),
(19, 19, 2),
(20, 20, 21),
(21, 21, 46),
(22, 22, 20),
(23, 23, 25),
(24, 24, 27),
(25, 25, 43),
(26, 26, 22),
(27, 27, 47),
(28, 28, 8),
(29, 29, 26),
(30, 30, 12),
(31, 31, 38),
(32, 32, 37),
(33, 33, 24),
(34, 34, 9),
(35, 35, 33),
(36, 36, 36),
(37, 37, 45),
(38, 38, 44),
(39, 39, 18),
(40, 40, 41),
(41, 41, 11),
(42, 42, 19),
(43, 43, 35),
(44, 44, 23),
(45, 45, 16),
(46, 46, 48),
(47, 47, 32),
(48, 48, 31),
(49, 49, 34),
(50, 50, 49);


-- DATOS PARA LA TABLA ESTADO_HISTORIA_CLINICA

INSERT INTO estado_historia_clinica (id_estado, nombre_estado, descripcion) VALUES
(1, 'En Registro', 'Historia en proceso de creación o edición'),
(2, 'Disponible', 'Historia clínica lista para ser consultada'),
(3, 'En Consulta', 'Historia actualmente en uso por un profesional'),
(4, 'En actualización', 'Se están realizando modificaciones a la historia'),
(5, 'Depurado', 'Historia revisada y depurada de errores o duplicados'),
(6, 'Archivado', 'Historia clínica almacenada sin uso activo');


--  DATOS PARA LA TABLA HISTORIA_CLINICA

INSERT INTO historia_clinica (id_historia, id_estado, id_perfil_medico, fecha_creacion) VALUES
(1, 1, 3, '2020-01-10'),
(2, 2, 15, '2020-02-15'),
(3, 3, 7, '2020-03-20'),
(4, 4, 22, '2020-04-05'),
(5, 5, 8, '2020-05-12'),
(6, 6, 30, '2020-06-18'),
(7, 1, 12, '2020-07-22'),
(8, 2, 45, '2020-08-30'),
(9, 3, 18, '2020-09-05'),
(10, 4, 5, '2020-10-11'),
(11, 5, 28, '2020-11-15'),
(12, 6, 10, '2020-12-20'),
(13, 1, 33, '2021-01-25'),
(14, 2, 19, '2021-02-28'),
(15, 3, 42, '2021-03-05'),
(16, 4, 14, '2021-04-10'),
(17, 5, 27, '2021-05-15'),
(18, 6, 36, '2021-06-20'),
(19, 1, 9, '2021-07-25'),
(20, 2, 48, '2021-08-30'),
(21, 3, 21, '2021-09-05'),
(22, 4, 6, '2021-10-10'),
(23, 5, 39, '2021-11-15'),
(24, 6, 17, '2021-12-20'),
(25, 1, 44, '2022-01-25'),
(26, 2, 11, '2022-02-28'),
(27, 3, 25, '2022-03-05'),
(28, 4, 50, '2022-04-10'),
(29, 5, 2, '2022-05-15'),
(30, 6, 31, '2022-06-20'),
(31, 1, 16, '2022-07-25'),
(32, 2, 41, '2022-08-30'),
(33, 3, 4, '2022-09-05'),
(34, 4, 29, '2022-10-10'),
(35, 5, 13, '2022-11-15'),
(36, 6, 37, '2022-12-20'),
(37, 1, 20, '2023-01-25'),
(38, 2, 49, '2023-02-28'),
(39, 3, 1, '2023-03-05'),
(40, 4, 26, '2023-04-10'),
(41, 5, 38, '2023-05-15'),
(42, 6, 23, '2023-06-20'),
(43, 1, 47, '2023-07-25'),
(44, 2, 32, '2023-08-30'),
(45, 3, 24, '2023-09-05'),
(46, 4, 43, '2023-10-10'),
(47, 5, 35, '2023-11-15'),
(48, 6, 40, '2023-12-20'),
(49, 1, 34, '2024-01-25'),
(50, 2, 46, '2024-02-28');


--  DATOS PARA LA TABLA PACIENTE

INSERT INTO paciente (id_paciente, id_persona, id_historia, tipo_seguro, situacion_juridica, esta_vivo, etapa_vida) VALUES
(1, 1, 1, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(2, 2, 2, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(3, 3, 3, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(4, 4, 4, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(5, 5, 5, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(6, 6, 6, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(7, 7, 7, '+SEGURO', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(8, 8, 8, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(9, 9, 9, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(10, 10, 10, '+SALUD', 'Plenamente Capaz', TRUE, 'Joven'),
(11, 11, 11, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(12, 12, 12, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(13, 13, 13, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(14, 14, 14, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(15, 15, 15, '+SALUD', 'Plenamente Capaz', TRUE, 'Joven'),
(16, 16, 16, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(17, 17, 17, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(18, 18, 18, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(19, 19, 19, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(20, 20, 20, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(21, 21, 21, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(22, 22, 22, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(23, 23, 23, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(24, 24, 24, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(25, 25, 25, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(26, 26, 26, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(27, 27, 27, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(28, 28, 28, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(29, 29, 29, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(30, 30, 30, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(31, 31, 31, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(32, 32, 32, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(33, 33, 33, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(34, 34, 34, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(35, 35, 35, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(36, 36, 36, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(37, 37, 37, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(38, 38, 38, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(39, 39, 39, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(40, 40, 40, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(41, 41, 41, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(42, 42, 42, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(43, 43, 43, '+VIDA', 'Incapacitado Legalmente', TRUE, 'Adulto Mayor'),
(44, 44, 44, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto'),
(45, 45, 45, '+SEGURO', 'Plenamente Capaz', TRUE, 'Joven'),
(46, 46, 46, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(47, 47, 47, '+PROTECCIÓN', 'Plenamente Capaz', TRUE, 'Adulto'),
(48, 48, 48, '+SEGURO', 'Plenamente Capaz', TRUE, 'Adulto'),
(49, 49, 49, '+VIDA', 'Incapacitado Legalmente', FALSE, 'Adulto Mayor'),
(50, 50, 50, '+SALUD', 'Plenamente Capaz', TRUE, 'Adulto');


-- DATOS PARA LA TABLA SOLICITUD

INSERT INTO solicitud (id_solicitud, id_persona, id_administrador, descripcion, motivo, fecha_solicitud, estado_solicitud) VALUES
(1, 5, 3, 'Acceso con rol de Personal Médico', 'Nuevo médico contratado necesita acceso al sistema para gestionar historias clínicas', '2023-03-01 09:15:22', 'Aprobado'),
(2, 12, 2, 'Acceso con rol de Asistente Administrativo', 'Personal de recepción requiere acceso para registrar nuevos pacientes', '2023-03-02 10:30:45', 'Aprobado'),
(3, 18, 5, 'Acceso con rol de Paciente', 'Paciente crónico necesita acceso a su historial médico', '2023-03-03 11:45:10', 'Rechazado'),
(4, 23, 1, 'Acceso con rol de Jefe de Servicio Médico', 'Nuevo jefe de cardiología necesita permisos elevados', '2023-03-04 14:20:33', 'Aprobado'),
(5, 27, 4, 'Acceso con rol de Personal Médico', 'Residente médico necesita acceso temporal por rotación', '2023-03-05 08:10:15', 'Pendiente'),
(6, 32, 7, 'Acceso con rol de Asistente Administrativo', 'Asistente de farmacia necesita actualizar su rol', '2023-03-06 16:45:28', 'Aprobado'),
(7, 38, 6, 'Acceso con rol de Paciente', 'Acceso para paciente post-operado', '2023-03-07 13:30:19', 'Aprobado'),
(8, 42, 9, 'Acceso con rol de Personal Médico', 'Enfermera jefe necesita acceso a módulo de medicación', '2023-03-08 10:15:42', 'Aprobado'),
(9, 45, 8, 'Acceso con rol de Jefe de Servicio Médico', 'Director de pediatría solicita permisos adicionales', '2023-03-09 09:25:37', 'Rechazado'),
(10, 49, 10, 'Acceso con rol de Asistente Administrativo', 'Personal de archivo necesita acceso para digitalización', '2023-03-10 11:40:55', 'Pendiente'),
(11, 2, 3, 'Acceso con rol de Paciente', 'Paciente con tratamiento prolongado solicita acceso', '2023-03-11 15:20:18', 'Aprobado'),
(12, 15, 1, 'Acceso con rol de Personal Médico', 'Médico especialista nuevo en el hospital', '2023-03-12 08:45:29', 'Aprobado'),
(13, 21, 4, 'Acceso con rol de Asistente Administrativo', 'Asistente de laboratorio clínico', '2023-03-13 14:10:33', 'Rechazado'),
(14, 30, 7, 'Acceso con rol de Paciente', 'Acceso para paciente con citas frecuentes', '2023-03-14 10:30:47', 'Aprobado'),
(15, 36, 2, 'Acceso con rol de Jefe de Servicio Médico', 'Jefe de cirugía solicita permisos completos', '2023-03-15 09:15:22', 'Aprobado'),
(16, 44, 5, 'Acceso con rol de Personal Médico', 'Médico de guardia necesita credenciales', '2023-03-16 13:45:19', 'Pendiente'),
(17, 9, 8, 'Acceso con rol de Asistente Administrativo', 'Nuevo asistente de consultorios externos', '2023-03-17 16:20:38', 'Aprobado'),
(18, 26, 6, 'Acceso con rol de Paciente', 'Paciente con tratamiento domiciliario', '2023-03-18 11:30:45', 'Rechazado'),
(19, 33, 9, 'Acceso con rol de Personal Médico', 'Médico residente en último año', '2023-03-19 08:40:12', 'Aprobado'),
(20, 41, 3, 'Acceso con rol de Jefe de Servicio Médico', 'Coordinador de emergencias', '2023-03-20 14:25:57', 'Aprobado'),
(21, 7, 7, 'Acceso con rol de Asistente Administrativo', 'Personal de facturación', '2023-03-21 10:15:33', 'Pendiente'),
(22, 19, 10, 'Acceso con rol de Paciente', 'Paciente para seguimiento postoperatorio', '2023-03-22 09:30:18', 'Aprobado'),
(23, 28, 4, 'Acceso con rol de Personal Médico', 'Médico de familia con pacientes crónicos', '2023-03-23 13:20:44', 'Aprobado'),
(24, 37, 1, 'Acceso con rol de Asistente Administrativo', 'Asistente de unidad de cuidados intensivos', '2023-03-24 15:45:29', 'Rechazado'),
(25, 50, 2, 'Acceso con rol de Paciente', 'Paciente con enfermedad crónica necesita monitoreo', '2023-03-25 11:10:37', 'Aprobado');



-- DATOS PARA LA TABLA TIPO_SERVICIO

INSERT INTO tipo_servicio (id_tipo_servicio, nombre) VALUES
(1, 'Consulta Médica'),
(2, 'Examen'),
(3, 'Terapia'),
(4, 'Intervención Quirúrgica'),
(5, 'Hospitalización');


-- DATOS PARA LA TABLA SUBTIPO_SERVICIO

INSERT INTO subtipo_servicio (id_subtipo_servicio, id_tipo_servicio, nombre) VALUES
(1, 1, 'Consulta Medicina General'),
(2, 1, 'Consulta Pediatría'),
(3, 1, 'Consulta Ginecología'),
(4, 1, 'Consulta Cardiología'),
(5, 1, 'Consulta Dermatología'),
(6, 1, 'Consulta Odontológica General'),
(7, 1, 'Consulta Psicológica Adulto'),
(8, 1, 'Consulta Psicológica Infantil'),
(9, 1, 'Teleconsulta Medicina General'),
(10, 1, 'Teleconsulta Psicología'),
(11, 1, 'Teleconsulta Nutrición'),
(12, 1, 'Teleconsulta Control Crónico'),
(13, 2, 'Toma de Muestra Sanguínea'),
(14, 2, 'Perfil Lipídico'),
(15, 2, 'Prueba de Embarazo'),
(16, 2, 'Examen de Orina'),
(17, 2, 'Prueba PCR COVID-19'),
(18, 2, 'Radiografía'),
(19, 2, 'Ecografía'),
(20, 2, 'Resonancia Magnética'),
(21, 2, 'Tomografía'),
(22, 2, 'Mamografía'),
(23, 2, 'Evaluación Cognitiva'),
(24, 2, 'Evaluación Preocupacional'),
(25, 2, 'Control Periódico'),
(26, 2, 'Reintegro Laboral'),
(27, 2, 'Seguimiento por Ausentismo'),
(28, 2, 'Ergonomía'),
(29, 3, 'Terapia Física'),
(30, 3, 'Terapia Respiratoria'),
(31, 3, 'Terapia Ocupacional'),
(32, 3, 'Terapia del Lenguaje'),
(33, 3, 'Rehabilitación Neurológica'),
(34, 4, 'Extracción Dental'),
(35, 4, 'Endodoncia'),
(36, 4, 'Ortodoncia'),
(37, 4, 'Cesárea'),
(38, 4, 'Colecistectomía'),
(39, 4, 'Apendicectomía'),
(40, 4, 'Cirugía de Cataratas'),
(41, 4, 'Cirugía de Hernia Inguinal'),
(42, 4, 'Cirugía Laparoscópica Abdominal'),
(43, 4, 'Cirugía de Vesícula Biliar'),
(44, 4, 'Cirugía de Rodilla (Artroscopia)'),
(45, 5, 'Hospitalización Pediátrica'),
(46, 5, 'Hospitalización Adulto'),
(47, 5, 'UCI Neonatal'),
(48, 5, 'UCI Adulto'),
(49, 5, 'Hospitalización Obstétrica'),
(50, 5, 'Atención por Trauma'),
(51, 5, 'Atención por Dolor Torácico'),
(52, 5, 'Atención por Crisis Hipertensiva'),
(53, 5, 'Atención por Convulsiones'),
(54, 5, 'Atención por Accidente');


-- DATOS PARA LA TABLA CIE10

INSERT INTO cie10 (id_cie10, codigo, descripcion) VALUES
(1, 'A00', 'Cólera'),
(2, 'A09', 'Diarrea y gastroenteritis de presunto origen infeccioso'),
(3, 'B20', 'Enfermedad por VIH'),
(4, 'C50', 'Neoplasia maligna de mama'),
(5, 'D50', 'Anemia por deficiencia de hierro'),
(6, 'E10', 'Diabetes tipo 1'),
(7, 'E11', 'Diabetes tipo 2'),
(8, 'E66', 'Obesidad'),
(9, 'F32', 'Episodio depresivo'),
(10, 'F41', 'Trastornos de ansiedad generalizada'),
(11, 'G40', 'Epilepsia'),
(12, 'H10', 'Conjuntivitis'),
(13, 'I10', 'Hipertensión esencial (primaria)'),
(14, 'I20', 'Angina de pecho'),
(15, 'I21', 'Infarto agudo del miocardio'),
(16, 'J00', 'Resfriado común'),
(17, 'J01', 'Sinusitis aguda'),
(18, 'J03', 'Amigdalitis aguda'),
(19, 'J45', 'Asma'),
(20, 'K21', 'Enfermedad por reflujo gastroesofágico'),
(21, 'K35', 'Apendicitis aguda'),
(22, 'K40', 'Hernia inguinal'),
(23, 'L20', 'Dermatitis atópica'),
(24, 'L30', 'Dermatitis inespecífica'),
(25, 'M15', 'Poliartritis'),
(26, 'M54', 'Lumbalgia'),
(27, 'N30', 'Cistitis'),
(28, 'N39', 'Trastornos urinarios no especificados'),
(29, 'O80', 'Parto único espontáneo'),
(30, 'P07', 'Prematurez'),
(31, 'Q90', 'Síndrome de Down'),
(32, 'R05', 'Tos'),
(33, 'R50', 'Fiebre de origen desconocido'),
(34, 'S00', 'Herida superficial de la cabeza'),
(35, 'S06', 'Lesión intracraneal'),
(36, 'T78', 'Alergia no especificada'),
(37, 'Z00', 'Control de salud general'),
(38, 'Z01', 'Examen especial'),
(39, 'Z20', 'Contacto con enfermedades transmisibles'),
(40, 'Z30', 'Anticoncepción'),
(41, 'Z34', 'Control del embarazo'),
(42, 'Z38', 'Nacimiento en hospital'),
(43, 'Z51', 'Quimioterapia'),
(44, 'Z52', 'Donación de órganos'),
(45, 'Z55', 'Problemas educativos'),
(46, 'Z60', 'Problemas relacionados con entorno social'),
(47, 'Z70', 'Consejería sobre comportamiento sexual'),
(48, 'Z71', 'Consejería general'),
(49, 'Z72', 'Problemas relacionados con el estilo de vida'),
(50, 'Z99', 'Dependencia de dispositivos');


-- DATOS PARA LA TABLA MORBILIDAD

INSERT INTO morbilidad (
    id_morbilidad, id_cie10, descripcion, fecha_identificacion, tipo, nivel_gravedad, contagiosa
) VALUES
(1, 7, 'Diabetes tipo 2 no controlada', '2024-01-10', 'Crónica', 'Moderada', FALSE),
(2, 13, 'Hipertensión esencial no complicada', '2024-02-15', 'Crónica', 'Leve', FALSE),
(3, 19, 'Asma leve intermitente', '2024-03-05', 'Crónica', 'Leve', TRUE),
(4, 21, 'Apendicitis sin perforación', '2024-03-20', 'Aguda', 'Grave', FALSE),
(5, 3, 'VIH en fase sintomática', '2024-01-25', 'Crónica', 'Grave', TRUE),
(6, 9, 'Depresión moderada', '2024-04-01', 'Mental', 'Moderada', FALSE),
(7, 10, 'Ansiedad persistente', '2024-04-02', 'Mental', 'Leve', FALSE),
(8, 26, 'Lumbalgia crónica', '2024-04-10', 'Crónica', 'Moderada', FALSE),
(9, 4, 'Cáncer de mama izquierda', '2024-03-25', 'Crónica', 'Grave', FALSE),
(10, 5, 'Anemia ferropénica leve', '2024-02-18', 'Crónica', 'Leve', FALSE),
(11, 8, 'Obesidad grado 1', '2024-04-15', 'Crónica', 'Moderada', FALSE),
(12, 11, 'Epilepsia controlada con medicamentos', '2024-01-30', 'Crónica', 'Moderada', FALSE),
(13, 2, 'Gastroenteritis aguda infantil', '2024-03-11', 'Aguda', 'Moderada', TRUE),
(14, 18, 'Amigdalitis bacteriana', '2024-03-19', 'Aguda', 'Leve', TRUE),
(15, 12, 'Conjuntivitis viral', '2024-03-21', 'Aguda', 'Leve', TRUE),
(16, 27, 'Cistitis recurrente', '2024-02-27', 'Crónica', 'Moderada', FALSE),
(17, 41, 'Control prenatal normal', '2024-05-01', 'Control', 'N/A', FALSE),
(18, 23, 'Dermatitis atópica leve', '2024-04-05', 'Crónica', 'Leve', FALSE),
(19, 17, 'Sinusitis aguda maxilar', '2024-03-10', 'Aguda', 'Moderada', TRUE),
(20, 37, 'Chequeo médico anual', '2024-01-05', 'Control', 'N/A', FALSE),
(21, 40, 'Inicio de método anticonceptivo', '2024-04-20', 'Control', 'N/A', FALSE),
(22, 20, 'Reflujo gastroesofágico', '2024-02-28', 'Crónica', 'Leve', FALSE),
(23, 47, 'Consejería psicológica', '2024-04-30', 'Mental', 'N/A', FALSE),
(24, 46, 'Consejería sexual en adolescentes', '2024-05-02', 'Educativa', 'N/A', FALSE),
(25, 32, 'Tos seca persistente', '2024-03-03', 'Aguda', 'Leve', TRUE),
(26, 45, 'Bajo rendimiento escolar', '2024-04-18', 'Conductual', 'N/A', FALSE),
(27, 44, 'Problemas familiares en el hogar', '2024-02-14', 'Social', 'N/A', FALSE),
(28, 50, 'Dependencia de oxígeno domiciliario', '2024-03-22', 'Crónica', 'Grave', FALSE),
(29, 34, 'Herida en cuero cabelludo', '2024-05-10', 'Aguda', 'Moderada', FALSE),
(30, 35, 'Conmoción cerebral', '2024-01-12', 'Aguda', 'Grave', FALSE),
(31, 43, 'Quimioterapia por neoplasia', '2024-02-06', 'Crónica', 'Grave', FALSE),
(32, 44, 'Donador de sangre', '2024-04-12', 'Control', 'N/A', FALSE),
(33, 28, 'Incontinencia urinaria', '2024-01-28', 'Crónica', 'Moderada', FALSE),
(34, 25, 'Poliartritis reumatoide', '2024-03-18', 'Crónica', 'Moderada', FALSE),
(35, 24, 'Eccema inespecífico', '2024-02-20', 'Crónica', 'Leve', FALSE),
(36, 1, 'Cólera confirmado por laboratorio', '2024-03-01', 'Aguda', 'Grave', TRUE),
(37, 39, 'Exposición a COVID-19', '2024-01-15', 'Preventiva', 'N/A', TRUE),
(38, 42, 'Recién nacido sano', '2024-05-05', 'Control', 'N/A', FALSE),
(39, 6, 'Diabetes tipo 1 con hipoglucemias', '2024-03-17', 'Crónica', 'Grave', FALSE),
(40, 15, 'Infarto de miocardio reciente', '2024-02-10', 'Aguda', 'Grave', FALSE),
(41, 14, 'Angina inestable', '2024-02-12', 'Crónica', 'Grave', FALSE),
(42, 22, 'Hernia inguinal derecha', '2024-04-22', 'Crónica', 'Moderada', FALSE),
(43, 29, 'Parto vaginal sin complicaciones', '2024-05-20', 'Aguda', 'Leve', FALSE),
(44, 31, 'Síndrome de Down leve', '2024-01-20', 'Crónica', 'Leve', FALSE),
(45, 30, 'Prematuro extremo', '2024-03-13', 'Aguda', 'Grave', FALSE),
(46, 38, 'Examen oftalmológico', '2024-04-25', 'Control', 'N/A', FALSE),
(47, 49, 'Consumo de alcohol', '2024-02-01', 'Conductual', 'Moderada', FALSE),
(48, 36, 'Alergia alimentaria múltiple', '2024-03-06', 'Crónica', 'Moderada', TRUE),
(49, 46, 'Consejería sexual en adultos mayores', '2024-04-26', 'Educativa', 'N/A', FALSE),
(50, 33, 'Fiebre sin foco aparente', '2024-05-03', 'Aguda', 'Moderada', TRUE);


-- DATOS PARA LA TABLA CITA_MEDICA

INSERT INTO cita_medica (
    id_cita_medica, id_paciente, id_personal_medico, estado, actividad, fecha_hora_programada
) VALUES
(1, 12, 5, 'Completado', 'Consulta general', '2025-05-01 09:00:00'),
(2, 7, 14, 'Pendiente', 'Control de presión arterial', '2025-05-01 10:30:00'),
(3, 33, 2, 'Cancelado', 'Revisión odontológica', '2025-05-01 11:00:00'),
(4, 18, 22, 'Completado', 'Examen de laboratorio', '2025-05-01 12:15:00'),
(5, 49, 8, 'Pendiente', 'Consulta psicológica', '2025-05-02 08:45:00'),
(6, 6, 17, 'Completado', 'Vacunación', '2025-05-02 09:30:00'),
(7, 25, 4, 'Pendiente', 'Evaluación preoperatoria', '2025-05-02 10:00:00'),
(8, 15, 30, 'Completado', 'Consulta pediátrica', '2025-05-02 11:00:00'),
(9, 44, 9, 'Completado', 'Electrocardiograma', '2025-05-02 13:30:00'),
(10, 9, 1, 'Cancelado', 'Control de diabetes', '2025-05-03 08:00:00'),
(11, 20, 11, 'Completado', 'Consulta general', '2025-05-03 09:00:00'),
(12, 3, 3, 'Pendiente', 'Curación de herida', '2025-05-03 10:15:00'),
(13, 47, 6, 'Completado', 'Consulta nutricional', '2025-05-03 11:30:00'),
(14, 30, 25, 'Completado', 'Terapia respiratoria', '2025-05-03 12:45:00'),
(15, 39, 12, 'Pendiente', 'Examen de sangre', '2025-05-03 13:15:00'),
(16, 5, 10, 'Cancelado', 'Consulta ginecológica', '2025-05-04 09:00:00'),
(17, 14, 18, 'Pendiente', 'Consulta urológica', '2025-05-04 10:00:00'),
(18, 26, 21, 'Completado', 'Consulta dermatológica', '2025-05-04 11:30:00'),
(19, 2, 7, 'Pendiente', 'Evaluación de cirugía menor', '2025-05-04 13:00:00'),
(20, 41, 19, 'Completado', 'Consulta geriátrica', '2025-05-04 14:00:00'),
(21, 50, 27, 'Pendiente', 'Consulta traumatológica', '2025-05-05 08:00:00'),
(22, 19, 13, 'Cancelado', 'Vacunación', '2025-05-05 09:30:00'),
(23, 1, 24, 'Completado', 'Consulta psiquiátrica', '2025-05-05 10:00:00'),
(24, 22, 20, 'Completado', 'Toma de signos vitales', '2025-05-05 11:00:00'),
(25, 36, 29, 'Pendiente', 'Evaluación neurológica', '2025-05-05 12:30:00'),
(26, 4, 5, 'Completado', 'Chequeo anual', '2025-05-05 13:00:00'),
(27, 32, 6, 'Pendiente', 'Consulta general', '2025-05-06 09:00:00'),
(28, 13, 1, 'Cancelado', 'Consulta ginecológica', '2025-05-06 10:00:00'),
(29, 46, 14, 'Completado', 'Consulta psicológica', '2025-05-06 11:30:00'),
(30, 35, 3, 'Completado', 'Revisión dental', '2025-05-06 12:00:00'),
(31, 21, 2, 'Pendiente', 'Curación postoperatoria', '2025-05-06 13:15:00'),
(32, 10, 8, 'Completado', 'Electrocardiograma', '2025-05-07 08:45:00'),
(33, 17, 23, 'Completado', 'Control prenatal', '2025-05-07 10:00:00'),
(34, 45, 28, 'Pendiente', 'Evaluación nutricional', '2025-05-07 11:15:00'),
(35, 23, 15, 'Cancelado', 'Control posparto', '2025-05-07 12:00:00'),
(36, 37, 16, 'Completado', 'Chequeo pediátrico', '2025-05-07 13:30:00'),
(37, 8, 26, 'Pendiente', 'Consulta traumatológica', '2025-05-08 09:00:00'),
(38, 11, 30, 'Completado', 'Examen auditivo', '2025-05-08 10:15:00'),
(39, 43, 4, 'Pendiente', 'Consulta oftalmológica', '2025-05-08 11:00:00'),
(40, 28, 22, 'Completado', 'Control de medicación', '2025-05-08 13:00:00'),
(41, 24, 7, 'Cancelado', 'Consulta geriátrica', '2025-05-08 14:15:00'),
(42, 38, 17, 'Completado', 'Evaluación preoperatoria', '2025-05-09 08:00:00'),
(43, 40, 19, 'Pendiente', 'Consulta odontológica', '2025-05-09 09:00:00'),
(44, 16, 12, 'Completado', 'Consulta general', '2025-05-09 10:00:00'),
(45, 29, 9, 'Completado', 'Vacunación', '2025-05-09 11:00:00'),
(46, 31, 6, 'Pendiente', 'Consulta nutricional', '2025-05-09 12:30:00'),
(47, 48, 11, 'Completado', 'Control de presión arterial', '2025-05-10 08:30:00'),
(48, 34, 25, 'Pendiente', 'Consulta ginecológica', '2025-05-10 09:30:00'),
(49, 42, 13, 'Cancelado', 'Chequeo general', '2025-05-10 10:30:00'),
(50, 27, 2, 'Completado', 'Electrocardiograma', '2025-05-10 11:45:00'),
(51, 9, 1, 'Pendiente', 'Consulta general', '2025-05-10 12:00:00'),
(52, 12, 14, 'Completado', 'Control de peso', '2025-05-11 09:00:00'),
(53, 3, 3, 'Completado', 'Consulta nutricional', '2025-05-11 10:00:00'),
(54, 47, 20, 'Pendiente', 'Curación de herida', '2025-05-11 11:00:00'),
(55, 6, 21, 'Cancelado', 'Evaluación neurológica', '2025-05-11 12:00:00'),
(56, 44, 24, 'Completado', 'Consulta psicológica', '2025-05-11 13:00:00'),
(57, 15, 5, 'Pendiente', 'Chequeo de rutina', '2025-05-11 14:00:00'),
(58, 50, 28, 'Completado', 'Examen físico', '2025-05-12 08:30:00'),
(59, 19, 18, 'Completado', 'Consulta pediátrica', '2025-05-12 09:30:00'),
(60, 36, 10, 'Pendiente', 'Revisión de tratamiento', '2025-05-12 10:30:00'),
(61, 33, 27, 'Cancelado', 'Consulta de seguimiento', '2025-05-12 11:45:00'),
(62, 18, 8, 'Completado', 'Control médico', '2025-05-12 13:00:00'),
(63, 25, 16, 'Pendiente', 'Evaluación médica', '2025-05-12 14:00:00'),
(64, 7, 6, 'Completado', 'Consulta general', '2025-05-13 09:00:00'),
(65, 22, 7, 'Cancelado', 'Control de diabetes', '2025-05-13 10:00:00'),
(66, 30, 1, 'Pendiente', 'Examen de sangre', '2025-05-13 11:00:00'),
(67, 39, 22, 'Completado', 'Consulta urológica', '2025-05-13 12:00:00'),
(68, 14, 19, 'Pendiente', 'Control de peso', '2025-05-13 13:00:00'),
(69, 35, 15, 'Completado', 'Consulta general', '2025-05-13 14:00:00'),
(70, 4, 26, 'Pendiente', 'Consulta dermatológica', '2025-05-14 09:00:00'),
(71, 10, 30, 'Completado', 'Control de presión arterial', '2025-05-14 10:00:00'),
(72, 23, 4, 'Pendiente', 'Consulta psicológica', '2025-05-14 11:00:00'),
(73, 28, 17, 'Cancelado', 'Evaluación general', '2025-05-14 12:00:00'),
(74, 1, 23, 'Completado', 'Consulta médica', '2025-05-14 13:00:00'),
(75, 5, 13, 'Pendiente', 'Chequeo anual', '2025-05-14 14:00:00'),
(76, 41, 11, 'Completado', 'Consulta cardiológica', '2025-05-15 08:00:00'),
(77, 26, 9, 'Pendiente', 'Examen oftalmológico', '2025-05-15 09:00:00'),
(78, 37, 12, 'Completado', 'Consulta endocrinológica', '2025-05-15 10:00:00'),
(79, 13, 29, 'Cancelado', 'Terapia física', '2025-05-15 11:00:00'),
(80, 49, 18, 'Completado', 'Control de embarazo', '2025-05-15 12:00:00'),
(81, 20, 2, 'Pendiente', 'Consulta reumatológica', '2025-05-15 13:00:00'),
(82, 32, 16, 'Completado', 'Examen neurológico', '2025-05-15 14:00:00'),
(83, 8, 24, 'Pendiente', 'Consulta oncológica', '2025-05-16 08:30:00'),
(84, 46, 5, 'Completado', 'Control postoperatorio', '2025-05-16 09:30:00'),
(85, 17, 27, 'Cancelado', 'Consulta neumológica', '2025-05-16 10:30:00'),
(86, 45, 20, 'Completado', 'Evaluación geriátrica', '2025-05-16 11:30:00'),
(87, 21, 8, 'Pendiente', 'Consulta gastroenterológica', '2025-05-16 12:30:00'),
(88, 38, 14, 'Completado', 'Control de hipertensión', '2025-05-16 13:30:00'),
(89, 11, 25, 'Pendiente', 'Consulta hematológica', '2025-05-16 14:30:00'),
(90, 43, 1, 'Completado', 'Chequeo preventivo', '2025-05-16 15:00:00');


-- DATOS PARA LA TABLA ORDEN_MEDICA

INSERT INTO orden_medica (id_orden, motivo, observaciones, id_tipo_servicio, id_subtipo_servicio, cantidad) VALUES
-- CONSULTAS MÉDICAS
(1, 'Control médico general de rutina', 'Paciente refiere buen estado general, requiere evaluación preventiva anual', 1, 1, 1),
(2, 'Erupción cutánea en extremidades superiores', 'Lesiones pruriginosas de 5 días de evolución, posible dermatitis de contacto', 1, 5, 1),
(3, 'Seguimiento de tratamiento dermatológico', 'Control post-tratamiento para dermatitis atópica, evaluar respuesta terapéutica', 1, 5, 1),
(4, 'Control de diabetes mellitus tipo 2', 'Paciente diabético en tratamiento, requiere ajuste de medicación y seguimiento', 1, 12, 1),
(5, 'Seguimiento de hipertensión arterial', 'Control de presión arterial y adherencia al tratamiento antihipertensivo', 1, 12, 1),
(6, 'Síntomas respiratorios leves', 'Tos seca y congestión nasal de 3 días, descartar infección respiratoria', 1, 9, 1),
(7, 'Control ginecológico de rutina', 'Paciente de 35 años para evaluación ginecológica anual y citología', 1, 3, 1),
(8, 'Consulta por cefalea recurrente', 'Episodios de cefalea tensional, evaluar factores desencadenantes', 1, 9, 1),
(9, 'Dolor precordial atípico', 'Paciente refiere molestias torácicas intermitentes, descartar origen cardíaco', 1, 4, 1),
(10, 'Evaluación psicológica infantil', 'Niño de 8 años con dificultades de atención y comportamiento escolar', 1, 8, 1),
(11, 'Sospecha de COVID-19', 'Paciente con síntomas compatibles: fiebre, tos y anosmia de 2 días', 2, 17, 1),
(12, 'Evaluación de masa abdominal', 'Paciente refiere dolor abdominal y masa palpable, requiere TAC para diagnóstico', 2, 21, 1),
(13, 'Chequeo médico ocupacional anual', 'Trabajador de oficina para evaluación médica laboral de rutina', 2, 25, 1),
(14, 'Control post-COVID-19', 'Paciente recuperado de COVID-19, control serológico a los 3 meses', 2, 17, 1),
(15, 'Examen médico pre-empleo', 'Candidato a puesto administrativo requiere evaluación preocupacional', 2, 24, 1),
(16, 'Seguimiento de tratamiento oncológico', 'Control imagenológico post-quimioterapia para evaluar respuesta', 2, 21, 1),
(17, 'Infección urinaria recurrente', 'Paciente femenina con disuria y polaquiuria, tercer episodio en 6 meses', 2, 16, 1),
(18, 'Trauma en extremidad superior', 'Caída con dolor e impotencia funcional en muñeca derecha', 2, 18, 1),
(19, 'Evaluación ergonómica laboral', 'Trabajador con dolor lumbar crónico, evaluar puesto de trabajo', 2, 28, 1),
(20, 'Control de función renal', 'Paciente hipertenso en seguimiento, control de creatinina y proteinuria', 2, 16, 1),
(21, 'Rehabilitación post-ACV', 'Paciente con secuelas neurológicas de ACV, requiere neurorehabilitación integral', 3, 33, 1),
(22, 'Trastorno del lenguaje infantil', 'Niño de 4 años con retraso en desarrollo del lenguaje expresivo', 3, 32, 1),
(23, 'Lumbalgia crónica', 'Dolor lumbar de 6 meses de evolución, limitación funcional moderada', 3, 29, 1),
(24, 'Rehabilitación post-fractura', 'Fractura de húmero consolidada, recuperar rango de movimiento', 3, 33, 1),
(25, 'EPOC en tratamiento', 'Paciente con enfermedad pulmonar obstructiva crónica, disnea grado II', 3, 30, 1),
(26, 'Tendinitis de hombro', 'Dolor y limitación funcional en hombro derecho, mejorar movilidad', 3, 29, 1),
(27, 'Asma bronquial en niño', 'Paciente pediátrico con crisis asmáticas frecuentes, educación respiratoria', 3, 30, 1),
(28, 'Secuelas de traumatismo craneal', 'Déficit cognitivo post-TEC, rehabilitación neuropsicológica', 3, 33, 1),
(29, 'Fibrosis pulmonar', 'Paciente con diagnóstico reciente de fibrosis pulmonar idiopática', 3, 30, 1),
(30, 'Artritis reumatoide', 'Rigidez matutina y dolor articular, mantener funcionalidad', 3, 29, 1),
(31, 'Embarazo de término gemelar', 'Gestante de 38 semanas con presentación podálica de segundo gemelar', 4, 37, 1),
(32, 'Maloclusión dental severa', 'Paciente de 16 años con apiñamiento dental y mordida cruzada', 4, 36, 1),
(33, 'Apendicitis aguda', 'Dolor en fosa ilíaca derecha, leucocitosis y signos de irritación peritoneal', 4, 39, 1),
(34, 'Necrosis pulpar dental', 'Pieza dental 26 con dolor intenso y diagnóstico de pulpitis irreversible', 4, 35, 1),
(35, 'Colelitiasis sintomática', 'Cólicos biliares recurrentes, ecografía confirma litiasis vesicular', 4, 42, 1),
(36, 'Colecistitis aguda', 'Dolor en hipocondrio derecho con signos inflamatorios, Murphy positivo', 4, 42, 1),
(37, 'Hernia inguinal bilateral', 'Paciente masculino con hernias inguinales sintomáticas bilaterales', 4, 41, 1),
(38, 'Caries profunda molar', 'Pieza dental 36 con destrucción coronaria extensa, preservar diente', 4, 35, 1),
(39, 'Colangitis aguda', 'Tríada de Charcot completa, requiere colecistectomía de urgencia', 4, 43, 1),
(40, 'Trabajo de parto prolongado', 'Distocia de presentación, FCF no reactiva, cesárea de urgencia', 4, 37, 1),
(41, 'Politraumatismo por accidente de tránsito', 'Paciente con trauma múltiple, fractura de fémur y contusión pulmonar', 5, 54, 1),
(42, 'Infarto agudo de miocardio', 'Dolor torácico típico con elevación del ST, requiere UCI', 5, 48, 1),
(43, 'Crisis hipertensiva', 'TA 220/120 mmHg con cefalea intensa y visión borrosa', 5, 52, 1),
(44, 'Neumonía bilateral', 'Paciente adulto mayor con neumonía adquirida en comunidad severa', 5, 46, 1),
(45, 'Shock séptico', 'Paciente con foco abdominal, hipotensión refractaria y falla multiorgánica', 5, 48, 1),
(46, 'Amenaza de parto prematuro', 'Gestante de 32 semanas con contracciones uterinas y modificaciones cervicales', 5, 49, 1),
(47, 'Preeclampsia severa', 'TA 170/110, proteinuria y cefalea, embarazo de 36 semanas', 5, 49, 1),
(48, 'Edema agudo pulmonar', 'Disnea súbita, ortopnea y estertores crepitantes bilaterales', 5, 48, 1),
(49, 'Quemaduras de segundo grado', 'Quemaduras en 25% de superficie corporal por escaldadura', 5, 50, 1),
(50, 'Intoxicación por organofosforados', 'Paciente rural con síndrome colinérgico por exposición a pesticidas', 5, 54, 1);


-- DATOS PARA LA TABLA CITA_ATENCION_ORDEN
INSERT INTO cita_atencion_orden (id_orden, id_cita_medica) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(31, 31),
(32, 32),
(33, 33),
(34, 34),
(35, 35),
(36, 36),
(37, 37),
(38, 38),
(39, 39),
(40, 40),
(41, 41),
(42, 42),
(43, 43),
(44, 44),
(45, 45),
(46, 46),
(47, 47),
(48, 48),
(49, 49),
(50, 50);


-- DATOS PARA LA TABLA SERVICIO_MEDICO

INSERT INTO servicio_medico (id_cita_medica, fecha_servicio, hora_inicio_servicio, hora_fin_servicio) VALUES
(1, '2025-05-01', '08:00:00', '08:30:00'),
(2, '2025-05-01', '09:00:00', '09:45:00'),
(3, '2025-05-01', '10:00:00', '10:20:00'),
(4, '2025-05-01', '11:00:00', '11:50:00'),
(5, '2025-05-01', '12:00:00', '12:30:00'),
(6, '2025-05-02', '08:00:00', '08:40:00'),
(7, '2025-05-02', '09:00:00', '09:25:00'),
(8, '2025-05-02', '10:00:00', '10:30:00'),
(9, '2025-05-02', '11:00:00', '11:45:00'),
(10, '2025-05-02', '12:00:00', '12:20:00'),
(11, '2025-05-03', '08:00:00', '08:30:00'),
(12, '2025-05-03', '09:00:00', '09:45:00'),
(13, '2025-05-03', '10:00:00', '10:50:00'),
(14, '2025-05-03', '11:00:00', '11:20:00'),
(15, '2025-05-03', '12:00:00', '12:35:00'),
(16, '2025-05-04', '08:00:00', '08:50:00'),
(17, '2025-05-04', '09:00:00', '09:20:00'),
(18, '2025-05-04', '10:00:00', '10:25:00'),
(19, '2025-05-04', '11:00:00', '11:40:00'),
(20, '2025-05-04', '12:00:00', '12:30:00'),
(21, '2025-05-05', '08:00:00', '08:45:00'),
(22, '2025-05-05', '09:00:00', '09:30:00'),
(23, '2025-05-05', '10:00:00', '10:40:00'),
(24, '2025-05-05', '11:00:00', '11:20:00'),
(25, '2025-05-05', '12:00:00', '12:25:00'),
(26, '2025-05-06', '08:00:00', '08:50:00'),
(27, '2025-05-06', '09:00:00', '09:45:00'),
(28, '2025-05-06', '10:00:00', '10:35:00'),
(29, '2025-05-06', '11:00:00', '11:30:00'),
(30, '2025-05-06', '12:00:00', '12:20:00'),
(31, '2025-05-07', '08:00:00', '08:30:00'),
(32, '2025-05-07', '09:00:00', '09:55:00'),
(33, '2025-05-07', '10:00:00', '10:20:00'),
(34, '2025-05-07', '11:00:00', '11:40:00'),
(35, '2025-05-07', '12:00:00', '12:25:00'),
(36, '2025-05-08', '08:00:00', '08:35:00'),
(37, '2025-05-08', '09:00:00', '09:25:00'),
(38, '2025-05-08', '10:00:00', '10:45:00'),
(39, '2025-05-08', '11:00:00', '11:20:00'),
(40, '2025-05-08', '12:00:00', '12:30:00'),
(41, '2025-05-09', '08:00:00', '08:40:00'),
(42, '2025-05-09', '09:00:00', '09:35:00'),
(43, '2025-05-09', '10:00:00', '10:30:00'),
(44, '2025-05-09', '11:00:00', '11:45:00'),
(45, '2025-05-09', '12:00:00', '12:25:00'),
(46, '2025-05-10', '08:00:00', '08:20:00'),
(47, '2025-05-10', '09:00:00', '09:50:00'),
(48, '2025-05-10', '10:00:00', '10:35:00'),
(49, '2025-05-10', '11:00:00', '11:30:00'),
(50, '2025-05-10', '12:00:00', '12:45:00'),
(51, '2025-04-23', '08:00:00', '08:30:00'),
(52, '2025-04-23', '09:00:00', '09:45:00'),
(53, '2025-04-23', '10:00:00', '10:20:00'),
(54, '2025-04-23', '11:00:00', '11:50:00'),
(55, '2025-04-23', '12:00:00', '12:30:00'),
(56, '2025-04-24', '08:00:00', '08:40:00'),
(57, '2025-04-24', '09:00:00', '09:25:00'),
(58, '2025-04-24', '10:00:00', '10:30:00'),
(59, '2025-04-24', '11:00:00', '11:45:00'),
(60, '2025-04-24', '12:00:00', '12:20:00'),
(61, '2025-04-25', '08:00:00', '08:30:00'),
(62, '2025-04-25', '09:00:00', '09:45:00'),
(63, '2025-04-25', '10:00:00', '10:50:00'),
(64, '2025-04-25', '11:00:00', '11:20:00'),
(65, '2025-04-25', '12:00:00', '12:35:00'),
(66, '2025-04-26', '08:00:00', '08:50:00'),
(67, '2025-04-26', '09:00:00', '09:20:00'),
(68, '2025-04-26', '10:00:00', '10:25:00'),
(69, '2025-04-26', '11:00:00', '11:40:00'),
(70, '2025-04-26', '12:00:00', '12:30:00'),
(71, '2025-04-27', '08:00:00', '08:45:00'),
(72, '2025-04-27', '09:00:00', '09:30:00'),
(73, '2025-04-27', '10:00:00', '10:40:00'),
(74, '2025-04-27', '11:00:00', '11:20:00'),
(75, '2025-04-27', '12:00:00', '12:25:00'),
(76, '2025-04-28', '08:00:00', '08:50:00'),
(77, '2025-04-28', '09:00:00', '09:45:00'),
(78, '2025-04-28', '10:00:00', '10:35:00'),
(79, '2025-04-28', '11:00:00', '11:30:00'),
(80, '2025-04-28', '12:00:00', '12:20:00'),
(81, '2025-04-29', '08:00:00', '08:30:00'),
(82, '2025-04-29', '09:00:00', '09:55:00'),
(83, '2025-04-29', '10:00:00', '10:20:00'),
(84, '2025-04-29', '11:00:00', '11:40:00'),
(85, '2025-04-29', '12:00:00', '12:25:00'),
(86, '2025-04-30', '08:00:00', '08:35:00'),
(87, '2025-04-30', '09:00:00', '09:25:00'),
(88, '2025-04-30', '10:00:00', '10:45:00'),
(89, '2025-04-30', '11:00:00', '11:20:00'),
(90, '2025-04-30', '12:00:00', '12:30:00');


-- DATOS PARA LA TABLA CONSULTA_MEDICA

INSERT INTO consulta_medica (id_servicio_medico, observaciones_generales, motivo_consulta, id_tipo_servicio, id_subtipo_servicio) VALUES
(1, 'Paciente refiere dolor leve en el costado derecho.', 'Dolor abdominal', 1, 2),
(2, 'Presión arterial elevada, se recomienda control semanal.', 'Chequeo de hipertensión', 1, 3),
(3, 'Lesión en rodilla durante actividad deportiva.', 'Dolor en articulación', 2, 4),
(4, 'Control de embarazo, todo dentro de parámetros normales.', 'Revisión prenatal', 3, 6),
(5, 'Paciente presenta fatiga y debilidad generalizada.', 'Cansancio extremo', 1, 2),
(6, 'Inflamación de amígdalas, posible amigdalitis.', 'Dolor de garganta', 2, 5),
(7, 'No se detectan anomalías. Paciente sano.', 'Chequeo general', 1, 1),
(8, 'Paciente refiere dificultad respiratoria leve.', 'Revisión por alergias', 2, 7),
(9, 'Dolor lumbar recurrente. Se sugiere fisioterapia.', 'Dolor de espalda', 2, 4),
(10, 'Paciente solicita renovación de receta médica.', 'Medicamento crónico', 1, 8);

-- DATOS PARA LA TABLA EXAMEN

INSERT INTO examen (id_servicio_medico, descripcion_procedimiento, fecha_hora_atencion, descripcion, tipo_procedimiento, tipo_laboratorio, resultado) VALUES
(11, 'Toma de muestra de sangre para hemograma completo', '2025-05-03 08:15:00', 'Hemograma completo solicitado por síntomas generales', 'Laboratorio clínico', 'Hematología', 'Leucocitos y hemoglobina en rangos normales.'),
(12, 'Radiografía de tórax AP y lateral', '2025-05-03 09:10:00', 'Paciente con dificultad respiratoria leve', 'Diagnóstico por imágenes', 'Radiología', 'No se observan infiltrados ni anomalías pulmonares.'),
(13, 'Examen de orina completo', '2025-05-03 10:05:00', 'Molestias urinarias reportadas por el paciente', 'Laboratorio clínico', 'Uroanálisis', 'Presencia leve de leucocitos, se sugiere cultivo.'),
(14, 'Electrocardiograma en reposo', '2025-05-03 11:00:00', 'Paciente refiere palpitaciones esporádicas', 'Cardiología no invasiva', 'Pruebas funcionales', 'Ritmo sinusal normal, sin alteraciones detectadas.'),
(15, 'Test rápido de glucosa capilar', '2025-05-03 12:10:00', 'Evaluación de niveles de glucosa por mareo', 'Evaluación rápida', 'Bioquímica', 'Glucosa: 94 mg/dL (normal en ayunas).'),
(16, 'Ecografía abdominal superior', '2025-05-04 08:20:00', 'Dolor en cuadrante superior derecho', 'Imágenes diagnósticas', 'Ecografía', 'Vesícula biliar con leve engrosamiento, sin litiasis.'),
(17, 'Cultivo de secreción faríngea', '2025-05-04 09:30:00', 'Amigdalitis recurrente', 'Análisis microbiológico', 'Bacteriología', 'Streptococcus β-hemolítico grupo A positivo.'),
(18, 'Prueba de embarazo en sangre', '2025-05-04 10:25:00', 'Paciente solicita descarte de embarazo', 'Test inmunológico', 'Serología', 'Resultado: Negativo.'),
(19, 'Prueba de función hepática', '2025-05-04 11:35:00', 'Control rutinario por antecedentes hepáticos', 'Laboratorio clínico', 'Bioquímica', 'Transaminasas dentro de rango normal.'),
(20, 'Resonancia magnética de rodilla izquierda', '2025-05-04 12:00:00', 'Lesión deportiva con dolor persistente', 'Imágenes diagnósticas avanzadas', 'Radiología', 'Desgarro parcial de menisco interno confirmado.');


-- DATOS PARA LA TABLA TERAPIA

INSERT INTO terapia (id_servicio_medico, descripcion, observaciones, resultados) VALUES
(21, 'Sesión de fisioterapia para dolor lumbar', 'Paciente con movilidad limitada al inicio', 'Mejoría parcial de rango de movimiento.'),
(22, 'Terapia ocupacional post-accidente', 'Paciente coopera activamente en ejercicios', 'Incremento en la coordinación motora fina.'),
(23, 'Terapia respiratoria con ejercicios diafragmáticos', 'Buena adherencia, sin signos de fatiga', 'Mejoría en frecuencia y profundidad respiratoria.'),
(24, 'Terapia psicológica individual (1ra sesión)', 'Paciente muestra apertura para el diálogo', 'Establecimiento de plan terapéutico.'),
(25, 'Sesión de rehabilitación de hombro izquierdo', 'Limitación moderada persistente', 'Leve mejoría en fuerza y flexión.'),
(26, 'Terapia del lenguaje por dislalia', 'Dificultades en fonemas /r/ y /s/', 'Avances notables en pronunciación de palabras clave.'),
(27, 'Terapia física post-operatoria de rodilla', 'Dolor leve durante los ejercicios', 'Movilidad articular incrementada un 15%.'),
(28, 'Psicoterapia para manejo de ansiedad', 'Paciente manifiesta pensamientos intrusivos', 'Reducción subjetiva de ansiedad en un 30%.'),
(29, 'Ejercicios de reeducación postural', 'Malos hábitos identificados y corregidos', 'Mejor alineación en posición sentado y de pie.'),
(30, 'Terapia con electroestimulación muscular', 'Buena tolerancia a la corriente aplicada', 'Aumento visible de contracción muscular voluntaria.');



-- DATOS PARA LA TABLA INTERVENCION_QUIRURGICA

INSERT INTO intervencion_quirurgica (id_servicio_medico, procedimiento_quirurgico, tipo_anestesia, observaciones) VALUES
(31, 'Apendicectomía laparoscópica', 'General', 'Procedimiento sin complicaciones. Recuperación postoperatoria estable.'),
(32, 'Colecistectomía por litiasis vesicular', 'General', 'Se extrajo vesícula sin incidentes. Se indicó dieta liviana.'),
(33, 'Sutura de herida en cuero cabelludo', 'Local', 'Paciente toleró bien la intervención. No hubo sangrado excesivo.'),
(34, 'Cesárea programada', 'Raquídea', 'Nacimiento sin complicaciones. Bebé y madre estables.'),
(35, 'Reducción cerrada de fractura de antebrazo', 'Regional', 'Buena alineación ósea. Se colocó yeso.'),
(36, 'Herniorrafia inguinal derecha', 'General', 'Paciente estable. Se indicó control en 7 días.'),
(37, 'Biopsia escisional de ganglio cervical', 'Local', 'Muestra enviada a anatomía patológica. Sin complicaciones.'),
(38, 'Cirugía menor: extracción de lipoma en espalda', 'Local', 'Lipoma completamente retirado. Curación diaria recomendada.'),
(39, 'Artroscopia de rodilla derecha', 'General', 'Leve inflamación postquirúrgica. Se indicó fisioterapia.'),
(40, 'Histerectomía total abdominal', 'General', 'Intervención exitosa. Se inició antibióticoterapia preventiva.');


-- DATOS PARA LA TABLA INGRESO_HOSPITALIZACION

INSERT INTO ingreso_hospitalizacion (id_servicio_medico, razon_ingreso, atenciones_necesarias, fecha_estimada_alta, nro_camas) VALUES
(41, 'Neumonía adquirida en la comunidad', 'Antibióticos intravenosos, control de signos vitales', '2025-05-13', 1),
(42, 'Fractura de fémur', 'Cirugía ortopédica, analgesia, fisioterapia', '2025-05-18', 1),
(43, 'Pancreatitis aguda', 'Hidratación parenteral, ayuno terapéutico, monitoreo', '2025-05-15', 1),
(44, 'Accidente cerebrovascular isquémico', 'Monitoreo neurológico, terapia física y ocupacional', '2025-05-20', 2),
(45, 'Descompensación diabética', 'Control glicémico intensivo, educación nutricional', '2025-05-12', 1),
(46, 'Postoperatorio de colecistectomía', 'Observación postquirúrgica, control de drenaje', '2025-05-11', 1),
(47, 'Complicaciones por insuficiencia cardíaca', 'Diuréticos IV, oxigenoterapia, control cardiológico', '2025-05-17', 2),
(48, 'Crisis asmática severa', 'Nebulizaciones frecuentes, corticoides sistémicos', '2025-05-10', 1),
(49, 'Infección urinaria con fiebre persistente', 'Antibióticos IV, control de urocultivo', '2025-05-09', 1),
(50, 'Observación post intento autolítico', 'Atención psiquiátrica, contención emocional', '2025-05-16', 1);


-- DATOS PARA LA TABLA ALTA_HOSPITALIZACION

INSERT INTO alta_hospitalizacion (id_servicio_medico, indicaciones_postalta, motivo_alta) VALUES
(51, 'Reposo relativo por 48 horas. Tomar medicación prescrita cada 8 horas. Control médico en 7 días.', 'Mejoría clínica satisfactoria'),
(52, 'Dieta blanda por 3 días. Evitar esfuerzos físicos. Continuar antibiótico por 5 días más.', 'Estabilización del cuadro infeccioso'),
(53, 'Controles de presión arterial diarios. Medicación antihipertensiva según prescripción. Cita de seguimiento en 2 semanas.', 'Presión arterial controlada'),
(54, 'Ejercicios respiratorios cada 4 horas. Inhaladores según indicación. Evitar exposición a irritantes.', 'Función pulmonar estabilizada'),
(55, 'Dieta hipoglucémica estricta. Controles de glucemia 3 veces al día. Insulina según esquema establecido.', 'Niveles de glucosa controlados'),
(56, 'Reposo absoluto por 24 horas luego reposo relativo. Analgésicos según necesidad. Control en 5 días.', 'Procedimiento quirúrgico exitoso'),
(57, 'Hidratación abundante. Medicación antiemética si presenta náuseas. Dieta progresiva según tolerancia.', 'Resolución del cuadro gastrointestinal'),
(58, 'Fisioterapia respiratoria 2 veces al día. Continuar con broncodilatadores. Evitar cambios bruscos de temperatura.', 'Mejoría del patrón respiratorio'),
(59, 'Cuidados de herida quirúrgica. Curaciones cada 48 horas. Antibiótico profiláctico por 7 días.', 'Evolución postoperatoria favorable'),
(60, 'Rehabilitación cardíaca gradual. Medicación cardioprotectora. Control cardiológico en 1 semana.', 'Función cardíaca estabilizada');

-- DATOS PARA LA TABLA UNIDAD_TIEMPO

INSERT INTO unidad_tiempo (id_unid_tiempo, nombre) VALUES
(1, 'Minuto'),
(2, 'Hora'),
(3, 'Día'),
(4, 'Semana'),
(5, 'Mes'),
(6, 'Año');


-- DATOS PARA LA TABLA MEDICAMENTO

INSERT INTO medicamento (id_medicamento, nombre_comercial, metodo_administracion, concentracion, laboratorio) VALUES
(1, 'Paracetamol', 'Oral', '500 mg', 'Genfar'),
(2, 'Ibuprofeno', 'Oral', '200 mg', 'Bayer'),
(3, 'Amoxicilina', 'Oral', '500 mg', 'Pfizer'),
(4, 'Ciprofloxacino', 'Oral', '500 mg', 'Roche'),
(5, 'Loratadina', 'Oral', '10 mg', 'Sanofi'),
(6, 'Omeprazol', 'Oral', '20 mg', 'Sandoz'),
(7, 'Metformina', 'Oral', '850 mg', 'Merck'),
(8, 'Losartán', 'Oral', '50 mg', 'Teva'),
(9, 'Enalapril', 'Oral', '10 mg', 'Bayer'),
(10, 'Simvastatina', 'Oral', '20 mg', 'Merck'),
(11, 'Aspirina', 'Oral', '100 mg', 'Bayer'),
(12, 'Salbutamol', 'Inhalación', '100 mcg', 'GlaxoSmithKline'),
(13, 'Prednisona', 'Oral', '5 mg', 'Pfizer'),
(14, 'Diclofenaco', 'Oral', '50 mg', 'Novartis'),
(15, 'Azitromicina', 'Oral', '500 mg', 'Sandoz'),
(16, 'Dexametasona', 'Inyectable', '4 mg/ml', 'Baxter'),
(17, 'Clorfenamina', 'Oral', '4 mg', 'Sanofi'),
(18, 'Acetaminofén', 'Oral', '160 mg/5ml', 'Genfar'),
(19, 'Insulina', 'Inyectable', '100 UI/ml', 'Novo Nordisk'),
(20, 'Ranitidina', 'Oral', '150 mg', 'GlaxoSmithKline'),
(21, 'Atorvastatina', 'Oral', '20 mg', 'Pfizer'),
(22, 'Bromuro de ipratropio', 'Inhalación', '20 mcg', 'Boehringer Ingelheim'),
(23, 'Ketorolaco', 'Oral', '10 mg', 'Roche'),
(24, 'Levotiroxina', 'Oral', '50 mcg', 'Merck'),
(25, 'Diazepam', 'Oral', '5 mg', 'Roche'),
(26, 'Sertralina', 'Oral', '50 mg', 'Pfizer'),
(27, 'Fluoxetina', 'Oral', '20 mg', 'Eli Lilly'),
(28, 'Clonazepam', 'Oral', '2 mg', 'Roche'),
(29, 'Furosemida', 'Oral', '40 mg', 'Sanofi'),
(30, 'Benzonatato', 'Oral', '100 mg', 'Teva'),
(31, 'Ambroxol', 'Oral', '30 mg/5ml', 'Bayer'),
(32, 'Mebendazol', 'Oral', '100 mg', 'Johnson & Johnson'),
(33, 'Albendazol', 'Oral', '400 mg', 'GlaxoSmithKline'),
(34, 'Clotrimazol', 'Tópico', '1%', 'Bayer'),
(35, 'Metronidazol', 'Oral', '500 mg', 'Pfizer'),
(36, 'Nistatina', 'Oral', '100,000 UI/ml', 'Eli Lilly'),
(37, 'Trimetoprim/Sulfametoxazol', 'Oral', '160/800 mg', 'Sandoz'),
(38, 'Fenitoína', 'Oral', '100 mg', 'Pfizer'),
(39, 'Carbamazepina', 'Oral', '200 mg', 'Novartis'),
(40, 'Risperidona', 'Oral', '2 mg', 'Janssen'),
(41, 'Haloperidol', 'Inyectable', '2 mg/ml', 'Teva'),
(42, 'Clopidogrel', 'Oral', '75 mg', 'Sanofi'),
(43, 'Warfarina', 'Oral', '5 mg', 'Bristol-Myers Squibb'),
(44, 'Insulina glargina', 'Inyectable', '100 UI/ml', 'Sanofi'),
(45, 'Insulina rápida', 'Inyectable', '100 UI/ml', 'Novo Nordisk'),
(46, 'Codeína', 'Oral', '30 mg', 'Genfar'),
(47, 'Oxicodona', 'Oral', '10 mg', 'Purdue Pharma'),
(48, 'Morfina', 'Inyectable', '10 mg/ml', 'Takeda'),
(49, 'Pantoprazol', 'Oral', '40 mg', 'Sandoz'),
(50, 'Clindamicina', 'Oral', '300 mg', 'Pfizer');


-- DATOS PARA LA TABLA TRATAMIENTO

INSERT INTO tratamiento (id_servicio_medico, razon, id_unid_tiempo, duracion_cantidad, observaciones) VALUES
(61, 'Antibioticoterapia para infección respiratoria aguda', 1, 7, 'Administrar cada 8 horas con alimentos para evitar molestias gástricas'),
(62, 'Tratamiento antihipertensivo para control de presión arterial', 1, 30, 'Monitorear presión arterial diariamente, ajustar dosis según evolución'),
(63, 'Quimioterapia adyuvante post-cirugía oncológica', 2, 6, 'Ciclos cada 21 días, controlar hemograma antes de cada sesión'),
(64, 'Fisioterapia para rehabilitación de fractura de fémur', 2, 12, 'Sesiones 3 veces por semana, progresión gradual de carga'),
(65, 'Insulinoterapia para control de diabetes mellitus tipo 1', 3, 6, 'Ajustar dosis según controles de glucemia capilar cada 6 horas'),
(66, 'Anticoagulación oral para prevención de tromboembolismo', 2, 3, 'Controlar INR semanalmente, mantener valores entre 2.0-3.0'),
(67, 'Corticoterapia para tratamiento de artritis reumatoide', 1, 21, 'Reducción gradual de dosis, monitorear efectos adversos'),
(68, 'Broncodilatadores para manejo de EPOC exacerbado', 1, 14, 'Inhaladores cada 6 horas, técnica de inhalación correcta'),
(69, 'Antidepresivos para tratamiento de episodio depresivo mayor', 2, 4, 'Inicio con dosis baja, incremento gradual según tolerancia'),
(70, 'Diuréticos para manejo de insuficiencia cardíaca congestiva', 1, 10, 'Controlar electrolitos y función renal semanalmente');


-- DATOS PARA LA TABLA TRATAMIENTO_MEDICAMENTO

INSERT INTO tratamiento_medicamento (id_tratamiento, id_medicamento, motivo, cantidad_dosis, frecuencia) VALUES
-- Tratamiento 1: Antibioticoterapia para infección respiratoria aguda
(1, 3, 'Tratamiento de infección bacteriana respiratoria', 1, 'Cada 8 horas por 7 días'),
(1, 15, 'Alternativa si hay alergia a penicilina', 1, 'Cada 12 horas por 5 días'),
(2, 8, 'Control de presión arterial sistólica y diastólica', 1, 'Una vez al día en la mañana'),
(2, 9, 'Cardioprotección adicional', 1, 'Una vez al día'),
(3, 16, 'Prevención de náuseas y vómitos por quimioterapia', 2, 'Antes de cada ciclo'),
(3, 1, 'Manejo del dolor asociado', 2, 'Cada 6 horas si es necesario'),
(4, 14, 'Control de dolor e inflamación articular', 1, 'Cada 12 horas con alimentos'),
(4, 1, 'Analgesia complementaria', 1, 'Cada 8 horas si hay dolor'),
(5, 19, 'Control de glucemia basal', 20, '2 veces al día (desayuno y cena)'),
(5, 45, 'Control postprandial de glucemia', 8, 'Antes de cada comida principal'),
(6, 43, 'Prevención de tromboembolismo', 1, 'Una vez al día a la misma hora'),
(6, 11, 'Cardioprotección adicional', 1, 'Una vez al día'),
(7, 13, 'Control de inflamación articular', 2, 'Una vez al día en la mañana'),
(7, 6, 'Protección gástrica', 1, 'Una vez al día antes del desayuno'),
(8, 12, 'Broncodilatación de acción rápida', 2, 'Cada 6 horas y en crisis'),
(8, 22, 'Broncodilatación de mantenimiento', 2, 'Cada 12 horas'),
(9, 26, 'Tratamiento de síntomas depresivos', 1, 'Una vez al día en la mañana'),
(9, 25, 'Manejo de ansiedad asociada', 1, 'Según necesidad, máximo 3 veces al día'),
(10, 29, 'Reducción de sobrecarga de volumen', 1, 'Una vez al día en la mañana'),
(10, 8, 'Control de presión arterial', 1, 'Una vez al día');

-- DATOS PARA LA TABLA DIAGNOSTICO

INSERT INTO diagnostico (id_morbilidad, id_servicio_medico, detalle) VALUES
(1, 71, 'Hemoglobina glicosilada 9.2%, requiere ajuste de tratamiento'),
(2, 72, 'Presión arterial 160/95 mmHg, inicio de terapia antihipertensiva'),
(3, 73, 'Espirometría con obstrucción leve reversible, crisis asmática controlada'),
(4, 74, 'Dolor en fosa ilíaca derecha, signo de Blumberg positivo'),
(15, 75, 'Hiperemia conjuntival bilateral con secreción serosa abundante'),
(13, 76, 'Deshidratación leve, deposiciones líquidas sin sangre ni moco'),
(19, 77, 'Dolor facial unilateral, secreción purulenta en meato medio'),
(9, 78, 'Masa palpable en cuadrante superior externo, biopsia programada'),
(40, 79, 'Elevación de troponinas, cambios en ECG derivaciones II, III, aVF'),
(22, 80, 'Pirosis postprandial, endoscopia muestra esofagitis grado A');


-- DATOS PARA LA TABLA SINTOMA

INSERT INTO sintoma (id_diagnostico, nombre_sintoma, fecha_primera_manifestacion, descripcion, severidad, estado_actual) VALUES
-- Síntomas para Diagnóstico 1: Diabetes tipo 2 (id_diagnostico = 1)
(1, 'Poliuria', '2024-01-05', 'Micción frecuente especialmente durante la noche', 7, 'Controlado'),
(1, 'Polidipsia', '2024-01-03', 'Sed excesiva y constante durante todo el día', 6, 'Mejorado'),
(1, 'Fatiga', '2024-01-01', 'Cansancio extremo sin causa aparente', 8, 'Controlado'),
(2, 'Cefalea', '2024-02-10', 'Dolor de cabeza pulsátil en región occipital', 6, 'Controlado'),
(2, 'Mareos', '2024-02-12', 'Sensación de inestabilidad al levantarse', 5, 'Mejorado'),
(2, 'Tinnitus', '2024-02-08', 'Zumbido en ambos oídos intermitente', 4, 'Estable'),
(3, 'Disnea', '2024-03-01', 'Dificultad respiratoria con el ejercicio', 7, 'Controlado'),
(3, 'Tos seca', '2024-02-28', 'Tos irritativa nocturna persistente', 6, 'Mejorado'),
(3, 'Sibilancias', '2024-03-02', 'Ruidos respiratorios agudos espiratorios', 8, 'Controlado'),
(4, 'Dolor abdominal', '2024-03-19', 'Dolor intenso que migra a fosa ilíaca derecha', 9, 'Resuelto'),
(4, 'Náuseas', '2024-03-19', 'Sensación de ganas de vomitar persistente', 7, 'Resuelto'),
(4, 'Vómitos', '2024-03-20', 'Episodios de vómito alimentario', 6, 'Resuelto'),
(5, 'Enrojecimiento ocular', '2024-03-19', 'Hiperemia conjuntival bilateral intensa', 6, 'Mejorado'),
(5, 'Lagrimeo', '2024-03-20', 'Secreción lagrimal excesiva y constante', 5, 'Mejorado'),
(5, 'Sensación de cuerpo extraño', '2024-03-21', 'Molestia como si tuviera arena en los ojos', 7, 'Controlado'),
(6, 'Diarrea', '2024-03-09', 'Deposiciones líquidas frecuentes sin sangre', 8, 'Resuelto'),
(6, 'Dolor abdominal', '2024-03-10', 'Dolor cólico difuso en mesogastrio', 7, 'Resuelto'),
(6, 'Deshidratación', '2024-03-11', 'Mucosas secas y disminución de turgencia', 6, 'Resuelto'),
(7, 'Dolor facial', '2024-03-08', 'Dolor intenso en región maxilar derecha', 8, 'Controlado'),
(7, 'Congestión nasal', '2024-03-07', 'Obstrucción nasal bilateral con rinorrea', 7, 'Mejorado'),
(7, 'Cefalea frontal', '2024-03-09', 'Dolor de cabeza en región frontal y supraorbitaria', 6, 'Controlado'),
(8, 'Masa palpable', '2024-03-20', 'Nódulo duro e irregular en cuadrante superior externo', 9, 'En estudio'),
(8, 'Retracción del pezón', '2024-03-22', 'Inversión del pezón izquierdo de aparición reciente', 7, 'Estable'),
(8, 'Cambios en la piel', '2024-03-23', 'Piel de naranja en área periareolar', 6, 'Estable'),
(9, 'Dolor torácico', '2024-02-10', 'Dolor opresivo retroesternal irradiado a brazo izquierdo', 10, 'Resuelto'),
(9, 'Disnea', '2024-02-10', 'Dificultad respiratoria en reposo', 8, 'Controlado'),
(9, 'Sudoración profusa', '2024-02-10', 'Diaforesis fría y pegajosa generalizada', 7, 'Resuelto'),
(10, 'Pirosis', '2024-02-25', 'Sensación de ardor retroesternal postprandial', 6, 'Controlado'),
(10, 'Regurgitación', '2024-02-26', 'Retorno de contenido gástrico a la boca', 5, 'Mejorado'),
(10, 'Disfagia', '2024-02-27', 'Dificultad para deglutir alimentos sólidos', 4, 'Estable');

-- DATOS PARA LA TABLA CONTROL

INSERT INTO control (id_servicio_medico, pulso_cardiaco, presion_diastolica, presion_sistolica, oxigenacion, estado_paciente, observaciones) VALUES
(81, 72, 80, 120, 98, 'Estable', 'Paciente en reposo, signos vitales normales'),
(82, 88, 85, 130, 96, 'Leve taquicardia', 'Posible ansiedad preoperatoria'),
(83, 65, 75, 115, 99, 'Estable', 'Postoperatorio sin complicaciones'),
(84, 94, 90, 140, 95, 'Hipertensión leve', 'Revisar medicación antihipertensiva'),
(85, 102, 78, 118, 97, 'Fiebre moderada', 'Posible infección, solicitar hemograma'),
(86, 70, 82, 125, 98, 'Estable', 'Control post-quirúrgico satisfactorio'),
(87, 110, 95, 150, 93, 'Crisis hipertensiva', 'Administrar nifedipino 10mg sublingual'),
(88, 68, 70, 110, 99, 'Estable', 'Alta programada para mañana'),
(89, 76, 84, 128, 97, 'Estable con dolor', 'Analgesia con paracetamol cada 8 horas'),
(90, 82, 88, 135, 96, 'Estable post-infarto', 'Monitoreo continuo en UCI');

-- Actualización de secuencias para evitar colisiones con valores existentes

SELECT setval('tipo_servicio_id_tipo_servicio_seq', COALESCE(MAX(id_tipo_servicio), 0) + 1, false) FROM tipo_servicio;
SELECT setval('subtipo_servicio_id_subtipo_servicio_seq', COALESCE(MAX(id_subtipo_servicio), 0) + 1, false) FROM subtipo_servicio;
SELECT setval('tipo_relacion_id_tipo_relacion_seq', COALESCE(MAX(id_tipo_relacion), 0) + 1, false) FROM tipo_relacion;
SELECT setval('especialidad_id_especialidad_seq', COALESCE(MAX(id_especialidad), 0) + 1, false) FROM especialidad;
SELECT setval('medicamento_id_medicamento_seq', COALESCE(MAX(id_medicamento), 0) + 1, false) FROM medicamento;
SELECT setval('cie10_id_cie10_seq', COALESCE(MAX(id_cie10), 0) + 1, false) FROM cie10;
SELECT setval('morbilidad_id_morbilidad_seq', COALESCE(MAX(id_morbilidad), 0) + 1, false) FROM morbilidad;
SELECT setval('alergia_id_alergia_seq', COALESCE(MAX(id_alergia), 0) + 1, false) FROM alergia;
SELECT setval('estado_historia_clinica_id_estado_seq', COALESCE(MAX(id_estado), 0) + 1, false) FROM estado_historia_clinica;
SELECT setval('rol_id_rol_seq', COALESCE(MAX(id_rol), 0) + 1, false) FROM rol;
SELECT setval('persona_id_persona_seq', COALESCE(MAX(id_persona), 0) + 1, false) FROM persona;
SELECT setval('perfil_medico_id_perfil_medico_seq', COALESCE(MAX(id_perfil_medico), 0) + 1, false) FROM perfil_medico;
SELECT setval('perfil_alergias_id_perfil_alergias_seq', COALESCE(MAX(id_perfil_alergias), 0) + 1, false) FROM perfil_alergias;
SELECT setval('administrador_id_administrador_seq', COALESCE(MAX(id_administrador), 0) + 1, false) FROM administrador;
SELECT setval('personal_medico_id_personal_medico_seq', COALESCE(MAX(id_personal_medico), 0) + 1, false) FROM personal_medico;
SELECT setval('turno_id_turno_seq', COALESCE(MAX(id_turno), 0) + 1, false) FROM turno;
SELECT setval('historia_clinica_id_historia_seq', COALESCE(MAX(id_historia), 0) + 1, false) FROM historia_clinica;
SELECT setval('paciente_id_paciente_seq', COALESCE(MAX(id_paciente), 0) + 1, false) FROM paciente;
SELECT setval('asignacion_rol_id_asignacion_rol_seq', COALESCE(MAX(id_asignacion_rol), 0) + 1, false) FROM asignacion_rol;
SELECT setval('solicitud_id_solicitud_seq', COALESCE(MAX(id_solicitud), 0) + 1, false) FROM solicitud;
SELECT setval('cita_medica_id_cita_medica_seq', COALESCE(MAX(id_cita_medica), 0) + 1, false) FROM cita_medica;
SELECT setval('servicio_medico_id_servicio_medico_seq', COALESCE(MAX(id_servicio_medico), 0) + 1, false) FROM servicio_medico;
SELECT setval('consulta_medica_id_consulta_medica_seq', COALESCE(MAX(id_consulta_medica), 0) + 1, false) FROM consulta_medica;
SELECT setval('orden_medica_id_orden_seq', COALESCE(MAX(id_orden), 0) + 1, false) FROM orden_medica;
SELECT setval('diagnostico_id_diagnostico_seq', COALESCE(MAX(id_diagnostico), 0) + 1, false) FROM diagnostico;
SELECT setval('unidad_tiempo_id_unid_tiempo_seq', COALESCE(MAX(id_unid_tiempo), 0) + 1, false) FROM unidad_tiempo;
SELECT setval('tratamiento_id_tratamiento_seq', COALESCE(MAX(id_tratamiento), 0) + 1, false) FROM tratamiento;
