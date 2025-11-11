require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixKpisMapping() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing kpis_mapping for cliente 14...\n');
    
    // 1. Get current metadata
    const currentMetadata = await client.query(`
      SELECT field_mapping, kpis_mapping
      FROM cliente_table_metadata
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `);
    
    if (currentMetadata.rows.length === 0) {
      console.log('❌ No metadata found for cliente 14');
      return;
    }
    
    console.log('📊 Current kpis_mapping structure:');
    const currentMapping = currentMetadata.rows[0].kpis_mapping;
    console.log('   Type:', typeof currentMapping);
    console.log('   Keys:', Object.keys(currentMapping || {}));
    
    // 2. Create correct mapping from KPIs data
    const kpisData = await client.query(`
      SELECT json_kpis
      FROM kpis
      WHERE cliente_id = 14
    `);
    
    if (kpisData.rows.length === 0) {
      console.log('❌ No KPIs found for cliente 14');
      return;
    }
    
    const jsonKpis = kpisData.rows[0].json_kpis;
    const correctMapping = {};
    
    // Build correct mapping: KPI title -> field name
    if (jsonKpis && jsonKpis.kpis) {
      jsonKpis.kpis.forEach(kpi => {
        if (kpi.titulo && kpi.inputs && kpi.inputs[0]) {
          correctMapping[kpi.titulo] = kpi.inputs[0];
        }
      });
    }
    
    console.log('\n✅ Correct mapping created:');
    Object.entries(correctMapping).forEach(([title, field]) => {
      console.log(`   "${title}" → "${field}"`);
    });
    
    // 3. Update the metadata
    await client.query(`
      UPDATE cliente_table_metadata
      SET kpis_mapping = $1
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `, [correctMapping]);
    
    console.log('\n✅ Metadata updated successfully');
    
    // 4. Verify the update
    const updatedMetadata = await client.query(`
      SELECT kpis_mapping
      FROM cliente_table_metadata
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `);
    
    console.log('\n📊 Verification:');
    const updatedMapping = updatedMetadata.rows[0].kpis_mapping;
    console.log('   Sample mappings:');
    Object.entries(updatedMapping).slice(0, 3).forEach(([title, field]) => {
      console.log(`   "${title}" → "${field}"`);
    });
    
    // 5. Test with actual query
    console.log('\n🧪 Testing with actual query:');
    const fieldName = updatedMapping['Evolución de Llamadas por Fecha'] || 'total_llamadas_fecha';
    console.log(`   Using field: ${fieldName}`);
    
    const testResult = await client.query(`
      SELECT payload->$1 as test_data
      FROM empresa_test_10
      WHERE cliente_id = 14
      LIMIT 1
    `, [fieldName]);
    
    if (testResult.rows.length > 0) {
      console.log('   Data retrieved:', JSON.stringify(testResult.rows[0].test_data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixKpisMapping();
