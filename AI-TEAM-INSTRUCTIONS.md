# AI Team Instructions 🤖

## Quick Start Guide for Gemini CLI & Qwen CLI

### Current Project Status
- ✅ TypeScript errors fixed
- ✅ Development server working  
- ✅ Published to GitHub
- 📍 Location: `c:\Users\rudybtzee\rudy-albums`
- 📍 Repository: `rodolfoiron9/rudybtz-btz`

---

## Task Assignment

### Gemini CLI - Please Handle These Tasks:
```bash
# 1. TESTING IMPLEMENTATION
cd c:\Users\rudybtzee\rudy-albums
npm run test
# Focus on: tests/components/ and tests/unit/
# Add tests for: audio-player.tsx, album-showcase.tsx, hero-section.tsx

# 2. DOCUMENTATION UPDATE
# Focus on: README.md, docs/ folder
# Document: API endpoints, component usage, deployment steps

# 3. ACCESSIBILITY IMPROVEMENTS  
# Focus on: components/ui/ folder
# Add: ARIA labels, keyboard navigation, screen reader support
```

### Qwen CLI - Please Handle These Tasks:
```bash
# 1. BUNDLE SIZE OPTIMIZATION
cd c:\Users\rudybtzee\rudy-albums
npm run build
npm run analyze
# Focus on: dynamic imports, tree shaking, lazy loading

# 2. PERFORMANCE MONITORING
# Focus on: components/performance/ folder
# Setup: Google Analytics, error tracking, performance metrics

# 3. DEPLOYMENT PREPARATION
# Focus on: next.config.ts, package.json, Dockerfile
# Setup: environment variables, production configuration
```

---

## Work Coordination Rules

### File Ownership (Avoid Conflicts)
- **Gemini CLI**: Work in `tests/`, `docs/`, `components/ui/`
- **Qwen CLI**: Work in `next.config.ts`, `package.json`, `components/performance/`
- **GitHub Copilot**: Coordinates and handles `lib/`, `components/admin/`

### Branch Strategy
```bash
# Gemini CLI - Create your branch
git checkout -b feature/gemini-improvements
git add .
git commit -m "[GEMINI] feat(test): add component tests"
git push origin feature/gemini-improvements

# Qwen CLI - Create your branch  
git checkout -b feature/qwen-optimization
git add .
git commit -m "[QWEN] perf(bundle): optimize build size"
git push origin feature/qwen-optimization

# I'll merge both branches when ready
```

### Communication Format
When you complete a task, respond with:
```
✅ COMPLETED: [Task name]
📁 Files Changed: [List of files]
🔍 Testing: [How to test your changes]
➡️ Next: [What should be done next]
```

---

## Priority Order

### Phase 1 (High Priority)
1. **Gemini**: Testing implementation
2. **Qwen**: Bundle optimization
3. **Copilot**: Audio analysis (Web Audio API)

### Phase 2 (Medium Priority)  
1. **Gemini**: Accessibility improvements
2. **Qwen**: Performance monitoring
3. **Copilot**: Admin authentication

### Phase 3 (Enhancement)
1. **Gemini**: Documentation completion
2. **Qwen**: Deployment setup
3. **Copilot**: Error boundaries

---

## Commands Reference

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run typecheck    # TypeScript check
npm run lint         # Code quality
```

### Git Commands
```bash
git status           # Check changes
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

---

## Ready to Start! 

**Gemini CLI**: Start with testing implementation in `tests/` folder
**Qwen CLI**: Start with bundle analysis using `npm run build`

Let's build an amazing portfolio together! 🚀