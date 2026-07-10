# 🧪 OnlinePDFEdits — Playwright Automation Tests

> My first QA automation project using **Playwright** + **TypeScript**  
> Testing: [onlinepdfedits.com](https://onlinepdfedits.com)

---

## 📁 Project Structure

```
onlinepdfedits-tests/
├── tests/
│   ├── pages/                     ← Page Object Models (POM)
│   │   ├── PdfToolsPage.ts        ← Selectors for /pdf-tools
│   │   └── HomePage.ts            ← Selectors for home page
│   ├── utils/
│   │   ├── helpers.ts             ← Reusable helper functions
│   │   └── constants.ts           ← All URLs and strings
│   ├── home-page.spec.ts          ← Home page tests
│   ├── pdf-tools-page.spec.ts     ← PDF Tools page tests (main)
│   ├── edit-pdf.spec.ts           ← Edit PDF tool tests
│   ├── navigation.spec.ts         ← Site-wide navigation tests
│   ├── accessibility.spec.ts      ← Basic accessibility checks
│   └── performance-and-security.spec.ts  ← Performance & HTTPS tests
├── test-data/                     ← Sample files for upload tests
├── screenshots/                   ← Auto-saved on failure
├── .github/workflows/
│   └── playwright.yml             ← GitHub Actions CI pipeline
├── playwright.config.ts           ← Playwright configuration
├── tsconfig.json                  ← TypeScript configuration
└── package.json
```

---

## ✅ What's Tested

| Area | Tests |
|---|---|
| Page Load | Title, URL, H1, console errors |
| Navigation | All 14 pages, back button, logo |
| Tool Cards | Visibility + click → correct URL |
| Quick Finder | All 4 shortcut links |
| Edit PDF | Upload input, accepted file types |
| Accessibility | Lang attr, single H1, image alt text, keyboard focus |
| Performance | Load time < 5s |
| Security | HTTPS, no mixed content, no server version leak |
| Footer | Privacy Policy, Terms, Copyright |
| Responsive | 375px mobile + 1440px desktop |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/onlinepdfedits-tests.git
cd onlinepdfedits-tests
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browsers
```bash
npx playwright install
```

### 4. Run all tests
```bash
npm test
```

### 5. Run tests with a visible browser (great for learning!)
```bash
npm run test:headed
```

### 6. Open the interactive UI mode
```bash
npm run test:ui
```

### 7. View the HTML report after a run
```bash
npm run report
```

---

## 🤖 CI / GitHub Actions

Every push to `main` automatically runs all tests in the cloud.

- Go to your repo → **Actions** tab to see results
- A green ✅ means all tests passed
- Download the **playwright-report** artifact to see the full HTML report

---

## 🧠 Key Concepts Used

| Concept | Where |
|---|---|
| **Page Object Model** | `tests/pages/` |
| **test.beforeEach** | Every spec file |
| **test.describe** | Groups of related tests |
| **expect assertions** | Every test |
| **Locators** | `getByRole`, `getByText`, `locator` |
| **Multiple browsers** | `playwright.config.ts` → projects |
| **Screenshots on failure** | `playwright.config.ts` |
| **GitHub Actions CI** | `.github/workflows/playwright.yml` |

---

## 📝 Author

**[Your Name]** — QA Engineer  
Connect with me on [LinkedIn](https://linkedin.com)

---

*Built as a first automation project to demonstrate Playwright skills.*
