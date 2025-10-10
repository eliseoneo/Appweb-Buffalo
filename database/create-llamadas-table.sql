-- ============================================================
-- CREATE TABLE FROM COLUMNAS FIELD
-- Generated from crear_kpis table, first record (id: 01dcd33b-bb67-4cba-a0f4-518752c83381)
-- ============================================================

CREATE TABLE IF NOT EXISTS llamadas_data (
  -- Identificadores
  id VARCHAR(255) NOT NULL,
  id_llamada VARCHAR(255),
  
  -- Información del Agente
  agent_name VARCHAR(255),
  agent_id VARCHAR(255),
  
  -- Métricas de Duración y Tiempo
  duracion_ms INTEGER,
  fecha_inicio TIMESTAMP,
  fecha_final TIMESTAMP,
  
  -- Estado de la Llamada
  razon_desconexion VARCHAR(255),
  sentimiento VARCHAR(255),
  
  -- Costos
  coste_total DECIMAL(10,2),
  coste_voice DECIMAL(10,2),
  cost_llm DECIMAL(10,2),
  cost_knowledge DECIMAL(10,2),
  
  -- Métricas Técnicas
  llm_tockens INTEGER,
  "latency:total" DECIMAL(10,2),
  latency_e2e DECIMAL(10,2),
  latency_llm DECIMAL(10,2),
  latency_tts DECIMAL(10,2),
  latency_kb DECIMAL(10,2),
  
  -- Información del Lead
  "lead name" VARCHAR(255),
  voicemail BOOLEAN,
  
  -- Calificación y Estado
  entrevista VARCHAR(255),
  "Situacion_laboral" VARCHAR(255),
  "Antigüedad_laboral" VARCHAR(255),
  nivel_estudios VARCHAR(255),
  turno_contacto VARCHAR(255),
  cargo VARCHAR(255),
  
  -- Información Adicional
  observaciones TEXT,
  transcripcion TEXT,
  
  -- Constraints
  PRIMARY KEY (id)
);

-- Indexes para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_llamadas_fecha_inicio ON llamadas_data(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_llamadas_agent_name ON llamadas_data(agent_name);
CREATE INDEX IF NOT EXISTS idx_llamadas_sentimiento ON llamadas_data(sentimiento);
CREATE INDEX IF NOT EXISTS idx_llamadas_entrevista ON llamadas_data(entrevista);

-- Comentarios en la tabla
COMMENT ON TABLE llamadas_data IS 'Tabla de datos de llamadas generada desde el campo columnas de crear_kpis';
COMMENT ON COLUMN llamadas_data.id IS 'Identificador único de la llamada, con un formato específico como CALL_1756982566330_9jpc9pg2v_kyn23tpqc_613062.';
COMMENT ON COLUMN llamadas_data.id_llamada IS 'Identificador único de la llamada, con un formato específico como call_b12f0d7bbdf6926ecbc37b5aa48.';
COMMENT ON COLUMN llamadas_data.agent_name IS 'Nombre del agente o el contexto de la llamada. Puede ser DEMO V2 PLANETA (llamada saliente), Si llaman a EAE (llamada entrante) o Llamar mas tarde al lead (llamada saliente programada).';
COMMENT ON COLUMN llamadas_data.agent_id IS 'Identificador único del agente, como agent_cca57189945925f90c98bd578a.';
COMMENT ON COLUMN llamadas_data.duracion_ms IS 'Duración de la llamada en segundos.';
COMMENT ON COLUMN llamadas_data.fecha_inicio IS 'Fecha y hora exacta en que la llamada comenzó.';
COMMENT ON COLUMN llamadas_data.fecha_final IS 'Fecha y hora exacta en que la llamada finalizó.';
COMMENT ON COLUMN llamadas_data.razon_desconexion IS 'Motivo de la desconexión de la llamada, categorizado como usuario cuelga, agente cuelga, no hay respuesta, ocupado o tiempo maximo.';
COMMENT ON COLUMN llamadas_data.sentimiento IS 'Sentimiento del usuario durante la llamada. Puede ser Negative, Positive, Neutral o Unknown (equivalente a Neutral).';
COMMENT ON COLUMN llamadas_data.coste_total IS 'Costo total de la llamada en euros.';
COMMENT ON COLUMN llamadas_data.coste_voice IS 'Costo de la voz de la llamada. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.cost_llm IS 'Costo del LLM (Large Language Model) utilizado. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.cost_knowledge IS 'Costo del conocimiento utilizado. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.llm_tockens IS 'Número de tokens del LLM. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data."latency:total" IS 'Latencia total. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.latency_e2e IS 'Latencia de extremo a extremo. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.latency_llm IS 'Latencia del LLM. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.latency_tts IS 'Latencia de Text-to-Speech. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.latency_kb IS 'Latencia de la base de conocimiento. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data."lead name" IS 'Nombre del usuario asociado a la llamada.';
COMMENT ON COLUMN llamadas_data.voicemail IS 'Indica si se dejó un mensaje de voz. Puede ser TRUE, FALSE o NULL. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.entrevista IS 'Estado de interés en una entrevista. Puede ser Calificado > Quiere entrevista, no se ha proporcionado esta info, Sin interes o No se puede contactar.';
COMMENT ON COLUMN llamadas_data."Situacion_laboral" IS 'Situación laboral del usuario. Puede ser Sí (trabajando), No (no trabajando), no se ha proporcionado esta info o NULL (no se pudo contactar).';
COMMENT ON COLUMN llamadas_data."Antigüedad_laboral" IS 'Antigüedad laboral del usuario. Puede ser <1 año, 1 año – 3 años, 3 años – 10 años, >10 años, NULL (no se pudo contactar) o no se ha proporcionado esta info.';
COMMENT ON COLUMN llamadas_data.nivel_estudios IS 'Nivel de estudios del usuario. Puede ser Estudios superiores, Bachillerato, Sin estudios oficiales, Estudios secundarios, NULL (no se pudo contactar) o no se ha proporcionado esta info.';
COMMENT ON COLUMN llamadas_data.turno_contacto IS 'Turno preferido para el contacto. Puede ser Tarde, Mañana, Mediodía (equivalente a Tarde), NULL (no se pudo contactar) o no se ha proporcionado esta info.';
COMMENT ON COLUMN llamadas_data.cargo IS 'Cargo del usuario. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.observaciones IS 'Observaciones adicionales. No relevante para el análisis.';
COMMENT ON COLUMN llamadas_data.transcripcion IS 'Transcripción de la llamada. No relevante para el análisis.';

