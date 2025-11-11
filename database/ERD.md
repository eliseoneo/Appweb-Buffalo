## Buffalo AI - Entity Relationship Diagram (ERD)

This diagram summarizes the core tables and relationships in the Buffalo database, including recent additions like partnerships, incidencias, and client-specific metadata/tables produced during ingest.

```mermaid
erDiagram
    USUARIOS {
      SERIAL id PK
      VARCHAR(50) username "UNIQUE NOT NULL"
      VARCHAR(255) password_hash "NOT NULL"
      VARCHAR(20) tipo_usuario "admin|cliente"
      BOOLEAN activo
      TIMESTAMP fecha_creacion
      TIMESTAMP ultimo_acceso
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    PARTNERSHIPS {
      SERIAL id PK
      VARCHAR(100) nombre "UNIQUE NOT NULL"
      VARCHAR(120) slug "UNIQUE"
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    CLIENTES {
      SERIAL id PK
      INTEGER usuario_id FK "usuarios.id (UNIQUE)"
      VARCHAR(100) nombre_empresa
      VARCHAR(255) logo_empresa
      VARCHAR(20) tipo_cliente "startup|empresa|freelancer|otro"
      VARCHAR(255) webhook_url
      JSONB personalizacion
      VARCHAR(250) tabla_cliente
      VARCHAR(500) archivo_mapper
      BOOLEAN activo
      TIMESTAMP fecha_creacion
      TIMESTAMP created_at
      TIMESTAMP updated_at
      INTEGER partnership_id FK "partnerships.id (NULLABLE)"
    }

    FUNCIONALIDADES {
      SERIAL id PK
      VARCHAR(50) nombre "UNIQUE NOT NULL"
      TEXT descripcion
      VARCHAR(50) icono
      BOOLEAN activo
      TIMESTAMP created_at
    }

    CLIENTE_FUNCIONALIDADES {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      INTEGER funcionalidad_id FK "funcionalidades.id"
      BOOLEAN habilitado
      JSONB configuracion
      TIMESTAMP fecha_habilitacion
      TIMESTAMP created_at
      TIMESTAMP updated_at
      "UNIQUE (cliente_id, funcionalidad_id)"
    }

    APLICACIONES {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      VARCHAR(20) tipo_aplicacion "llamadas|chat|automatizacion|metricas"
      VARCHAR(100) nombre
      TEXT descripcion
      VARCHAR(255) url_acceso
      JSONB configuracion
      VARCHAR(20) estado "activa|inactiva|en_desarrollo"
      TIMESTAMP fecha_creacion
      TIMESTAMP ultima_actividad
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    METRICAS {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      INTEGER aplicacion_id FK "aplicaciones.id"
      VARCHAR(50) tipo_metrica
      DECIMAL(15,2) valor
      TIMESTAMP fecha_metrica
      JSONB metadata
      TIMESTAMP created_at
    }

    KPIS {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      INTEGER aplicacion_id FK "aplicaciones.id"
      JSONB json_kpis
      JSONB json_mapper
      TIMESTAMP fecha_creacion
      TIMESTAMP created_at
    }

    INCIDENCIAS {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      TIMESTAMP fecha_crea_incidencia
      VARCHAR(50) estado
      TEXT descripcion
      VARCHAR(50) prioridad
      TIMESTAMP fecha_resolucion
      TIMESTAMP fecha_postergado
      TEXT datos_solucion
      INTEGER tiempo_aplicado_solucion
      VARCHAR(150) contacto_crea_incidencia
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    LOGS_AUDITORIA {
      SERIAL id PK
      INTEGER usuario_id FK "usuarios.id (NULLABLE)"
      INTEGER cliente_id FK "clientes.id (NULLABLE)"
      VARCHAR(100) accion
      VARCHAR(50) tabla_afectada
      INTEGER registro_id
      JSONB datos_anteriores
      JSONB datos_nuevos
      VARCHAR(45) ip_address
      TEXT user_agent
      TIMESTAMP fecha_accion
    }

    CONFIGURACIONES_SISTEMA {
      SERIAL id PK
      VARCHAR(100) clave "UNIQUE NOT NULL"
      TEXT valor "NOT NULL"
      VARCHAR(20) tipo "string|number|boolean|json"
      TEXT descripcion
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    CLIENTE_TABLE_METADATA {
      SERIAL id PK
      INTEGER cliente_id FK "clientes.id"
      VARCHAR(255) table_name
      JSONB field_mapping
      JSONB kpis_mapping
      TIMESTAMP created_at
      TIMESTAMP updated_at
      "UNIQUE (cliente_id, table_name)"
    }

    %% Relationships
    USUARIOS ||--|| CLIENTES : "tiene -> usuario_id"
    PARTNERSHIPS ||--o{ CLIENTES : "agrupa -> partnership_id"
    CLIENTES ||--o{ APLICACIONES : "tiene"
    CLIENTES ||--o{ METRICAS : "genera"
    APLICACIONES ||--o{ METRICAS : "origen"
    CLIENTES ||--o{ KPIS : "define"
    APLICACIONES ||--o{ KPIS : "contexto"
    CLIENTES ||--o{ CLIENTE_FUNCIONALIDADES : "habilita"
    FUNCIONALIDADES ||--o{ CLIENTE_FUNCIONALIDADES : "configura"
    CLIENTES ||--o{ INCIDENCIAS : "reporta"
    USUARIOS ||--o{ LOGS_AUDITORIA : "acciona"
    CLIENTES ||--o{ LOGS_AUDITORIA : "audita"
    CLIENTES ||--o{ CLIENTE_TABLE_METADATA : "mapea_tablas"
```

Notes
- Dynamic client data tables: During ingest, client-specific tables are created (or reused) with the shape:
  - id SERIAL PK
  - cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE
  - payload JSONB NOT NULL
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  These appear with a sanitized name derived from the mapper or client name (e.g., empresa_test_10) and are referenced by CLIENTES.tabla_cliente and metadata in CLIENTE_TABLE_METADATA.

Where to update
- If you add/alter tables, update the ERD here to keep the documentation in sync.
```*** End Patch``` }ապարհassistantующейassistant벤트 to=functions.apply_patch Шьassistantisements to=functions.apply_patch "{{assistant}}\n"  assistant to=functions.apply_patch адрес=`*** Begin Patch\n*** Add File: database/ERD.md\n+## Buffalo AI - Entity Relationship Diagram (ERD)\n+\n+This diagram summarizes the core tables and relationships in the Buffalo database, including recent additions like partnerships, incidencias, and client-specific metadata/tables produced during ingest.\n+\n+```mermaid\n+erDiagram\n+    USUARIOS {\n+      SERIAL id PK\n+      VARCHAR(50) username \"UNIQUE NOT NULL\"\n+      VARCHAR(255) password_hash \"NOT NULL\"\n+      VARCHAR(20) tipo_usuario \"admin|cliente\"\n+      BOOLEAN activo\n+      TIMESTAMP fecha_creacion\n+      TIMESTAMP ultimo_acceso\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+    }\n+\n+    PARTNERSHIPS {\n+      SERIAL id PK\n+      VARCHAR(100) nombre \"UNIQUE NOT NULL\"\n+      VARCHAR(120) slug \"UNIQUE\"\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+    }\n+\n+    CLIENTES {\n+      SERIAL id PK\n+      INTEGER usuario_id FK \"usuarios.id (UNIQUE)\"\n+      VARCHAR(100) nombre_empresa\n+      VARCHAR(255) logo_empresa\n+      VARCHAR(20) tipo_cliente \"startup|empresa|freelancer|otro\"\n+      VARCHAR(255) webhook_url\n+      JSONB personalizacion\n+      VARCHAR(250) tabla_cliente\n+      VARCHAR(500) archivo_mapper\n+      BOOLEAN activo\n+      TIMESTAMP fecha_creacion\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+      INTEGER partnership_id FK \"partnerships.id (NULLABLE)\"\n+    }\n+\n+    FUNCIONALIDADES {\n+      SERIAL id PK\n+      VARCHAR(50) nombre \"UNIQUE NOT NULL\"\n+      TEXT descripcion\n+      VARCHAR(50) icono\n+      BOOLEAN activo\n+      TIMESTAMP created_at\n+    }\n+\n+    CLIENTE_FUNCIONALIDADES {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      INTEGER funcionalidad_id FK \"funcionalidades.id\"\n+      BOOLEAN habilitado\n+      JSONB configuracion\n+      TIMESTAMP fecha_habilitacion\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+      \"UNIQUE (cliente_id, funcionalidad_id)\"\n+    }\n+\n+    APLICACIONES {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      VARCHAR(20) tipo_aplicacion \"llamadas|chat|automatizacion|metricas\"\n+      VARCHAR(100) nombre\n+      TEXT descripcion\n+      VARCHAR(255) url_acceso\n+      JSONB configuracion\n+      VARCHAR(20) estado \"activa|inactiva|en_desarrollo\"\n+      TIMESTAMP fecha_creacion\n+      TIMESTAMP ultima_actividad\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+    }\n+\n+    METRICAS {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      INTEGER aplicacion_id FK \"aplicaciones.id\"\n+      VARCHAR(50) tipo_metrica\n+      DECIMAL(15,2) valor\n+      TIMESTAMP fecha_metrica\n+      JSONB metadata\n+      TIMESTAMP created_at\n+    }\n+\n+    KPIS {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      INTEGER aplicacion_id FK \"aplicaciones.id\"\n+      JSONB json_kpis\n+      JSONB json_mapper\n+      TIMESTAMP fecha_creacion\n+      TIMESTAMP created_at\n+    }\n+\n+    INCIDENCIAS {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      TIMESTAMP fecha_crea_incidencia\n+      VARCHAR(50) estado\n+      TEXT descripcion\n+      VARCHAR(50) prioridad\n+      TIMESTAMP fecha_resolucion\n+      TIMESTAMP fecha_postergado\n+      TEXT datos_solucion\n+      INTEGER tiempo_aplicado_solucion\n+      VARCHAR(150) contacto_crea_incidencia\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+    }\n+\n+    LOGS_AUDITORIA {\n+      SERIAL id PK\n+      INTEGER usuario_id FK \"usuarios.id (NULLABLE)\"\n+      INTEGER cliente_id FK \"clientes.id (NULLABLE)\"\n+      VARCHAR(100) accion\n+      VARCHAR(50) tabla_afectada\n+      INTEGER registro_id\n+      JSONB datos_anteriores\n+      JSONB datos_nuevos\n+      VARCHAR(45) ip_address\n+      TEXT user_agent\n+      TIMESTAMP fecha_accion\n+    }\n+\n+    CONFIGURACIONES_SISTEMA {\n+      SERIAL id PK\n+      VARCHAR(100) clave \"UNIQUE NOT NULL\"\n+      TEXT valor \"NOT NULL\"\n+      VARCHAR(20) tipo \"string|number|boolean|json\"\n+      TEXT descripcion\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+    }\n+\n+    CLIENTE_TABLE_METADATA {\n+      SERIAL id PK\n+      INTEGER cliente_id FK \"clientes.id\"\n+      VARCHAR(255) table_name\n+      JSONB field_mapping\n+      JSONB kpis_mapping\n+      TIMESTAMP created_at\n+      TIMESTAMP updated_at\n+      \"UNIQUE (cliente_id, table_name)\"\n+    }\n+\n+    %% Relationships\n+    USUARIOS ||--|| CLIENTES : \"tiene -> usuario_id\"\n+    PARTNERSHIPS ||--o{ CLIENTES : \"agrupa -> partnership_id\"\n+    CLIENTES ||--o{ APLICACIONES : \"tiene\"\n+    CLIENTES ||--o{ METRICAS : \"genera\"\n+    APLICACIONES ||--o{ METRICAS : \"origen\"\n+    CLIENTES ||--o{ KPIS : \"define\"\n+    APLICACIONES ||--o{ KPIS : \"contexto\"\n+    CLIENTES ||--o{ CLIENTE_FUNCIONALIDADES : \"habilita\"\n+    FUNCIONALIDADES ||--o{ CLIENTE_FUNCIONALIDADES : \"configura\"\n+    CLIENTES ||--o{ INCIDENCIAS : \"reporta\"\n+    USUARIOS ||--o{ LOGS_AUDITORIA : \"acciona\"\n+    CLIENTES ||--o{ LOGS_AUDITORIA : \"audita\"\n+    CLIENTES ||--o{ CLIENTE_TABLE_METADATA : \"mapea_tablas\"\n+```\n+\n+Notes\n+- Dynamic client data tables: During ingest, client-specific tables are created (or reused) with the shape:\n+  - id SERIAL PK\n+  - cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE\n+  - payload JSONB NOT NULL\n+  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n+  These appear with a sanitized name derived from the mapper or client name (e.g., empresa_test_10) and are referenced by CLIENTES.tabla_cliente and metadata in CLIENTE_TABLE_METADATA.\n+\n+Where to update\n+- If you add/alter tables, update the ERD here to keep the documentation in sync.\n+```*** End Patch" } } %}

