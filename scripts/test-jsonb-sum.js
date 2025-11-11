const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const clienteId = 14;
    const tableName = 'empresa_test_10';

    const r1 = await client.query(
      `SELECT jsonb_typeof(payload->'total_conversacion_sostenidas_segundo') as t,
              payload->'total_conversacion_sostenidas_segundo' as v,
              payload->'total_conversacion_sostenidas_segundo'->>'valor' as val
       FROM ${tableName}
       WHERE cliente_id = $1
       LIMIT 1`,
      [clienteId]
    );
    console.log('Row sample:', r1.rows[0]);

    const r2 = await client.query(
      `SELECT 
          SUM(
            CASE 
              WHEN jsonb_typeof(payload->'total_conversacion_sostenidas_segundo') = 'object' THEN NULLIF((payload->'total_conversacion_sostenidas_segundo'->>'valor'), '')::numeric
              WHEN jsonb_typeof(payload->'total_conversacion_sostenidas_segundo') IN ('number','string') THEN NULLIF((payload->>'total_conversacion_sostenidas_segundo'), '')::numeric
              ELSE NULL
            END
          ) as sum_value
       FROM ${tableName}
       WHERE cliente_id = $1`,
      [clienteId]
    );
    console.log('Sum value:', r2.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
})();
