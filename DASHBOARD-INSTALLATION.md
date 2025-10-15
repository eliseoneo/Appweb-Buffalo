# Dashboard Installation Guide

Quick setup guide to get the Dashboard Base running.

---

## ⚡ Quick Install (2 minutes)

### Step 1: Install Required Dependency

```bash
npm install recharts
```

**Why Recharts?**
- Professional charting library
- React-friendly components
- Responsive and interactive
- Zero configuration needed

### Step 2: Verify Installation

```bash
npm list recharts
```

Expected output:
```
└── recharts@2.x.x
```

### Step 3: Run Dashboard

```bash
# Development mode
npm run dev

# Open browser
http://localhost:3000/n8n-dashboard
```

---

## ✅ Complete Installation (Optional)

If you want to ensure all dependencies are up to date:

```bash
# Install all project dependencies
npm install

# Install recharts specifically
npm install recharts

# Start development server
npm run dev
```

---

## 🚀 First Launch

### 1. Navigate to Dashboard

Open your browser and go to:
```
http://localhost:3000/n8n-dashboard
```

### 2. You Should See:

- ✅ 3 stat cards at the top (Total Calls, Response Rate, Total Cost)
- ✅ Line chart showing 30-day evolution
- ✅ 2 donut charts (Sentiment & Disconnect Reasons)
- ✅ 2 bar charts (Agent Performance & Cost per Conversion)
- ✅ 4 additional metric cards at bottom

### 3. Test Interactivity

- Hover over charts to see tooltips
- Check if "En vivo" (Live) indicator is pulsing
- Try the time period dropdown

---

## 🐛 Troubleshooting

### Issue: Charts Not Rendering

**Problem:** Blank spaces where charts should be

**Solution:**
```bash
# Reinstall recharts
npm uninstall recharts
npm install recharts

# Clear cache and restart
rm -rf .next
npm run dev
```

### Issue: "Module not found: recharts"

**Problem:** Dependency not installed

**Solution:**
```bash
npm install recharts
```

### Issue: TypeScript Errors

**Problem:** Type definitions missing

**Solution:**
```bash
# Recharts includes its own types, but if issues persist:
npm install --save-dev @types/node
```

### Issue: Styling Not Applied

**Problem:** Tailwind CSS not working

**Solution:**
```bash
# Ensure Tailwind is configured (should already be in this project)
# Restart dev server
npm run dev
```

---

## 📦 Dependencies Overview

### Required (New)
- `recharts` (^2.x.x) - Chart library

### Already in Project
- `react` (^18.x.x) - React framework
- `next` (^14.x.x) - Next.js framework
- `tailwindcss` (^3.x.x) - Styling

---

## 🔍 Verify Everything Works

### Checklist

```bash
# 1. Check Node.js version (should be 16+)
node --version

# 2. Check npm version
npm --version

# 3. Install dependencies
npm install recharts

# 4. Start server
npm run dev

# 5. Open browser
# Navigate to: http://localhost:3000/n8n-dashboard

# 6. Verify all components load:
#    - ✅ Header with "Dashboard Analytics"
#    - ✅ 3 stat cards
#    - ✅ Evolution line chart
#    - ✅ Sentiment donut chart
#    - ✅ Disconnect reasons donut chart
#    - ✅ Agent performance bar chart
#    - ✅ Cost per conversion bar chart
#    - ✅ 4 metric cards
#    - ✅ Info footer
```

---

## 🎨 Optional Enhancements

### Add More Chart Types

```bash
# Install additional chart libraries (optional)
npm install @tremor/react  # Alternative modern charts
npm install victory        # D3-based charts
```

### Performance Monitoring

```bash
# Add performance monitoring (optional)
npm install @vercel/analytics
```

---

## 🚀 Production Build

### Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start

# Navigate to dashboard
http://localhost:3000/n8n-dashboard
```

### Performance Check

```bash
# Analyze bundle size
npm run build

# Check for warnings or errors
# Optimize if needed
```

---

## 📱 Test Responsive Design

### Using Browser DevTools

1. Open dashboard: `http://localhost:3000/n8n-dashboard`
2. Press `F12` to open DevTools
3. Click the device toolbar icon (or `Ctrl+Shift+M`)
4. Test different screen sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width

### Expected Behavior

- **Mobile:** Single column, stacked layout
- **Tablet:** 2-column grid for most elements
- **Desktop:** 3-column stat cards, 2-column charts

---

## ✅ Success Indicators

You'll know the installation is successful when:

1. ✅ No errors in terminal
2. ✅ No errors in browser console (F12)
3. ✅ All charts render with data
4. ✅ Hover interactions work
5. ✅ Responsive layout adapts
6. ✅ Colors and styling match design

---

## 📊 Using Synthetic Data

### Current Setup

The dashboard uses synthetic data from:
```
app/n8n-dashboard/data/synthetic-data.ts
```

This includes:
- 2,847 calls
- 30 days of evolution data
- 3 agents (MODELO 1, MODELO 2, DEMO V2)
- 4 campaigns
- Realistic distributions

### To Connect Real Data

See: [DASHBOARD-BASE-PREVIEW.md](./DASHBOARD-BASE-PREVIEW.md)  
Section: "Integration with n8n"

---

## 🆘 Getting Help

### Documentation
- [Dashboard Preview](./DASHBOARD-BASE-PREVIEW.md) - Complete overview
- [Dashboard README](./app/n8n-dashboard/README.md) - Technical details
- [Project Summary](./N8N-DATA-NORMALIZATION-PROJECT-SUMMARY.md) - Full project

### Common Commands

```bash
# Install dependencies
npm install recharts

# Development mode
npm run dev

# Production build
npm run build

# Start production
npm start

# Clean cache
rm -rf .next node_modules
npm install
```

---

## ⏱️ Expected Install Time

- **Recharts installation:** 30 seconds
- **First dev server start:** 1-2 minutes
- **Dashboard first load:** 2-3 seconds
- **Total setup time:** ~3 minutes

---

## 🎉 You're Ready!

Once you see the dashboard with all charts rendering:

1. ✅ **Explore the data** - Hover over charts
2. ✅ **Check responsiveness** - Resize browser
3. ✅ **Review KPIs** - Understand each metric
4. ✅ **Plan integration** - Connect to real data

**Next:** Follow [DASHBOARD-BASE-PREVIEW.md](./DASHBOARD-BASE-PREVIEW.md) to connect n8n data

---

**Installation Status:** Ready to Install  
**Estimated Time:** 3 minutes  
**Difficulty:** Beginner-friendly  
**Support:** Full documentation available

