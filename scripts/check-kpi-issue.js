require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkKpiIssue() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking KPI configuration for cliente 14...\n');
    
    // 1. Check kpis table structure
    console.log('1️⃣ Checking kpis table structure:');
    const kpisStructure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'kpis'
      ORDER BY ordinal_position
    `);
    console.log('   Columns:', kpisStructure.rows.map(r => r.column_name).join(', '));
    
    // 2. Check kpis data
    console.log('\n2️⃣ Checking kpis for cliente 14:');
    const kpis = await client.query(`
      SELECT * FROM kpis WHERE cliente_id = 14 LIMIT 5
    `);
    console.log(`   Total KPIs: ${kpis.rowCount}`);
    if (kpis.rows.length > 0) {
      console.log('   Sample KPI:', JSON.stringify(kpis.rows[0], null, 2));
    }
    
    // 3. Check metadata mappings
    console.log('\n3️⃣ Checking metadata mappings:');
    const metadata = await client.query(`
      SELECT 
        field_mapping,
        kpis_mapping
      FROM cliente_table_metadata 
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `);
    
    if (metadata.rows.length > 0) {
      const kpisMapping = metadata.rows[0].kpis_mapping;
      console.log('   KPIs mapping sample:');
      if (kpisMapping) {
        Object.entries(kpisMapping).slice(0, 3).forEach(([key, value]) => {
          console.log(`   - "${key}" → "${value}"`);
        });
        
        // Look for date-related mapping
        const dateRelated = Object.entries(kpisMapping).find(([key, value]) => 
          key.toLowerCase().includes('fecha') || 
          key.toLowerCase().includes('evolución') ||
          value === 'total_llamadas_fecha'
        );
        if (dateRelated) {
          console.log(`\n   📅 Date-related mapping found:`);
          console.log(`   - "${dateRelated[0]}" → "${dateRelated[1]}"`);
        }
      }
    }
    
    // 4. Check the actual data in empresa_test_10
    console.log('\n4️⃣ Checking actual data in empresa_test_10:');
    const data = await client.query(`
      SELECT 
        payload,
        payload->'total_llamadas_fecha' as total_llamadas_fecha
      FROM empresa_test_10 
      WHERE cliente_id = 14
      LIMIT 1
    `);
    
    if (data.rows.length > 0) {
      console.log('   total_llamadas_fecha exists:', !!data.rows[0].total_llamadas_fecha);
      console.log('   Data sample:', JSON.stringify(data.rows[0].total_llamadas_fecha, null, 2));
      
      // Check all payload keys
      const payloadKeys = Object.keys(data.rows[0].payload);
      console.log('\n   All payload keys:', payloadKeys.join(', '));
    }
    
    // 5. Simulate what the API would do
    console.log('\n5️⃣ Simulating API query for "Evolución de Llamadas por Fecha y Hora":');
    
    // First get the mapping
    const mappingResult = await client.query(`
      SELECT kpis_mapping
      FROM cliente_table_metadata
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `);
    
    if (mappingResult.rows.length > 0 && mappingResult.rows[0].kpis_mapping) {
      const kpisMapping = mappingResult.rows[0].kpis_mapping;
      const fieldName = kpisMapping['Evolución de Llamadas por Fecha y Hora'] || 
                       kpisMapping['Evolución de Llamadas por Fecha'] ||
                       'total_llamadas_fecha';
      
      console.log(`   Using field: ${fieldName}`);
      
      // Query the actual data
      const dataResult = await client.query(`
        SELECT 
          payload->$1 as kpi_data
        FROM empresa_test_10
        WHERE cliente_id = 14
      `, [fieldName]);
      
      if (dataResult.rows.length > 0) {
        console.log('   Result:', JSON.stringify(dataResult.rows[0].kpi_data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

checkKpiIssue();
