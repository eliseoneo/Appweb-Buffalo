# Quick Start: n8n Data Normalization

Get started with data normalization in 5 minutes.

---

## ⚡ Instant Usage

### 1. Test the Normalizer (30 seconds)

```bash
# Run the normalizer on sample data
node scripts/n8n-data-normalizer.js documentation/example-var-from-agents-clean.json output/my-output.json

# Check the result
cat output/my-output.json
```

**Expected Output:**
```
✅ Normalization completed successfully!
   Records processed: 3
   Processing time: 2ms
```

---

## 🔧 Your Data (2 minutes)

### Prepare Your JSON File

Ensure your data looks like this:

```json
[
  {
    "id": "CALL_123...",
    "duration_ms": "15.5",
    "lead_name": "John",
    "razon_desconexion": "user_hangup",
    ...
  }
]
```

### Run Normalization

```bash
node scripts/n8n-data-normalizer.js your-data.json output/normalized.json
```

---

## 🌐 n8n Integration (5 minutes)

### Option 1: Code Node (Recommended)

1. Open n8n workflow
2. Add a **Code** node
3. Copy **entire contents** of `scripts/n8n-data-normalizer.js`
4. Paste into Code node
5. Add this at the end:

```javascript
const items = $input.all();
const rawData = items.map(item => item.json);
const result = normalizeData(rawData);
return result.data.map(record => ({ json: record }));
```

6. Connect to your data source
7. Test it!

### Option 2: HTTP Request

```bash
# Start a simple server (or use your own)
# Then configure n8n HTTP Request node:
# POST http://your-server:3000/normalize
# Body: {{ $json }}
```

---

## 📊 View Your KPIs

### Available KPIs (20 total)

**Top 5 Most Important:**

1. **Número Total de Llamadas** - Total call count
   - `COUNT(id)`

2. **Tasa de Respuesta** - Answer rate %
   - Calls answered / Total calls × 100

3. **Costo Total** - Total cost
   - `SUM(coste_total)`

4. **Sentimiento del Usuario** - Customer sentiment
   - Distribution of Positive/Neutral/Negative

5. **Costo por Conversión** - Cost per success
   - Total cost / Successful interviews

**See:** `documentation/KPI-DEFINITIONS.md` for all 20 KPIs

---

## 🗺️ What Gets Transformed

| Your Data | Becomes | Type |
|-----------|---------|------|
| `duration_ms: "12.5"` | `duracion_ms: 12.5` | Float |
| `lead_name: "John"` | `"lead name": "John"` | String |
| `razon_desconexion: "user_hangup"` | `razon_desconexion: "usuario cuelga"` | Translated |
| `MODEL: "1"` | `modelo: "1"` | Renamed |

---

## 📁 Key Files

```
scripts/
  ├── n8n-data-normalizer.js    ← Main script (use this!)
  └── field-mapping.json        ← Configuration

output/
  ├── normalized-output-sample.json    ← Example output
  └── n8n-workflow-data.json          ← n8n format example

documentation/
  ├── KPI-DEFINITIONS.md        ← All KPI details
  └── NORMALIZATION-GUIDE.md    ← Complete guide
```

---

## 🐛 Common Issues

### "Cannot parse JSON"
```bash
# Your JSON might be malformed. Fix it:
node scripts/fix-json-format.js
```

### "Module not found"
```bash
# Run from project root:
cd Buffalo-IA-Clean
node scripts/n8n-data-normalizer.js ...
```

### "Missing required fields"
Your data must include:
- `id`
- `id_llamada`
- `agent_name`
- `agent_id`
- `fecha_inicio`

---

## 🎯 Next Steps

1. ✅ Run the normalizer on your data
2. ✅ Integrate with n8n workflow
3. ✅ Connect to your database
4. ✅ Build dashboard with KPIs
5. ✅ Monitor and optimize

---

## 📚 Full Documentation

- **Complete Guide:** `documentation/NORMALIZATION-GUIDE.md`
- **KPI Reference:** `documentation/KPI-DEFINITIONS.md`
- **Project Summary:** `N8N-DATA-NORMALIZATION-PROJECT-SUMMARY.md`

---

## 💡 Pro Tips

1. **Start small** - Test with 3-10 records first
2. **Check output** - Always review normalized data
3. **Use verbose mode** - Add `{ verbose: true }` when debugging
4. **Keep backups** - Save original data before normalizing
5. **Monitor performance** - Track processing time

---

## 🆘 Need Help?

1. Check `documentation/NORMALIZATION-GUIDE.md`
2. Review example files in `documentation/`
3. Test with sample data: `example-var-from-agents-clean.json`

---

**Ready to normalize? Run this now:**

```bash
node scripts/n8n-data-normalizer.js documentation/example-var-from-agents-clean.json output/test.json
```

🎉 **You're ready to go!**

