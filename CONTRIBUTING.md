# Contributing to ngx-analytics-lite

Thank you for your interest in contributing! This document explains how to get set up, how we work, and our standards for code and commits.

---

## 📦 Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/angelo-1/ngx-analytics-lite.git
cd ngx-analytics-lite

# 2. Install dependencies
npm install

# 3. Build the library in watch mode (for iterative development)
npm run build:lib -- --watch

# 4. Run tests once
npm run test:lib

# 5. Run tests in watch mode
npm run test:lib -- --watch
```

---

## 🌿 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, published releases only |
| `develop` | Integration branch — all PRs target this |
| `feat/your-feature` | Feature work |
| `fix/issue-123-description` | Bug fixes |
| `docs/update-readme` | Documentation-only changes |

---

## ✍️ Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

| Type | When to use |
|------|-------------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructure, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build scripts, config, dependencies |
| `perf` | Performance improvements |
| `style` | Code style (whitespace, formatting) |

**Examples:**
```
feat(pie-chart): add click-to-navigate with custom event payload
fix(filter-bar): correctly debounce rapid date range changes
docs: update README with FilterBarComponent API table
refactor(base-chart): extract smartRefresh into separate private method
test(analytics-service): add coverage for selectedMetrics filter
```

---

## 🧪 Testing Requirements

All PRs **must** include unit tests. We target:
- **80%+ line coverage** for all `services/` and `utils/`
- **60%+ coverage** for `components/`

Run coverage report:
```bash
npm run test:lib -- --code-coverage
# Report: coverage/ngx-analytics-lite/index.html
```

---

## 🏗 Code Standards

- All new components must be **standalone** (`standalone: true`)
- Use **OnPush** change detection  
- All public `@Input()` / `@Output()` and exported functions must have **JSDoc comments**
- No `any` types on public API — use proper generics
- All new exports must be added to **`public-api.ts`**
- Update **`CHANGELOG.md`** for every meaningful change

---

## 📤 Submitting a PR

1. Fork the repo and create a branch from `develop`
2. Make your changes following the standards above
3. Run `npm run build:lib` and `npm run test:lib` — both must pass
4. Open a Pull Request against `develop`
5. Fill out the PR template completely

We review PRs as promptly as possible. Thank you! 🙏
