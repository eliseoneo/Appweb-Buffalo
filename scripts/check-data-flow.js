require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkDataFlow() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking data flow for cliente 14...\n');
    
    // 1. Check empresa_test_10 table
    console.log('1️⃣ Checking empresa_test_10 table:');
    const tableData = await client.query(`
      SELECT 
        id,
        cliente_id,
        payload->'total_llamadas_fecha' as total_llamadas_fecha,
        created_at
      FROM empresa_test_10 
      WHERE cliente_id = 14
    `);
    
    console.log(`   Rows found: ${tableData.rows.length}`);
    if (tableData.rows.length > 0) {
      console.log('   Sample data:');
      console.log('   total_llamadas_fecha:', JSON.stringify(tableData.rows[0].total_llamadas_fecha, null, 2));
    }
    
    // 2. Check cliente_table_metadata
    console.log('\n2️⃣ Checking cliente_table_metadata:');
    const metadata = await client.query(`
      SELECT 
        field_mapping,
        kpis_mapping
      FROM cliente_table_metadata 
      WHERE cliente_id = 14 AND table_name = 'empresa_test_10'
    `);
    
    console.log(`   Metadata rows: ${metadata.rows.length}`);
    if (metadata.rows.length > 0) {
      console.log('   Field mapping exists:', !!metadata.rows[0].field_mapping);
      console.log('   KPIs mapping exists:', !!metadata.rows[0].kpis_mapping);
      
      // Check if there's a mapping for the date KPI
      const kpisMapping = metadata.rows[0].kpis_mapping;
      if (kpisMapping) {
        const dateKpi = Object.entries(kpisMapping).find(([key, value]) => 
          key.includes('Fecha') || key.includes('Evolución')
        );
        if (dateKpi) {
          console.log('   Found date-related KPI mapping:', dateKpi);
        }
      }
    }
    
    // 3. Check clientes table
    console.log('\n3️⃣ Checking clientes table:');
    const clienteInfo = await client.query(`
      SELECT 
        id,
        nombre_empresa,
        tabla_cliente,
        archivo_mapper
      FROM clientes 
      WHERE id = 14
    `);
    
    if (clienteInfo.rows.length > 0) {
      console.log('   Cliente info:');
      console.log('   - nombre_empresa:', clienteInfo.rows[0].nombre_empresa);
      console.log('   - tabla_cliente:', clienteInfo.rows[0].tabla_cliente);
      console.log('   - archivo_mapper:', clienteInfo.rows[0].archivo_mapper);
    }
    
    // 4. Check KPIs table
    console.log('\n4️⃣ Checking kpis table:');
    const kpis = await client.query(`
      SELECT 
        id,
        titulo,
        tipo
      FROM kpis 
      WHERE cliente_id = 14 AND titulo LIKE '%Fecha%'
    `);
    
    console.log(`   Date-related KPIs: ${kpis.rows.length}`);
    kpis.rows.forEach(kpi => {
      console.log(`   - ${kpi.titulo} (${kpi.tipo})`);
    });
    
    // 5. Test the actual query that would be used
    console.log('\n5️⃣ Testing actual KPI query:');
    const testQuery = await client.query(`
      SELECT 
        payload->'total_llamadas_fecha' as data
      FROM empresa_test_10
      WHERE cliente_id = 14
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (testQuery.rows.length > 0) {
      console.log('   Query result:', JSON.stringify(testQuery.rows[0].data, null, 2));
    } else {
      console.log('   No data returned from query');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDataFlow();
