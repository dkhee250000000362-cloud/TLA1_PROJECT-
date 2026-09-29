 Enterprise Income Category Tracker (React Refactor)

Finals TLA 1 Project Portfolio Submission
Live Deployment Link: [https://tla-1-project-sigma.vercel.app/]
* **GitHub Source Code Repository https://github.com/dkhee250000000362-cloud/TLA1_PROJECT-

---

 AI Implementation & Code Defense Report

 1. AI Tool Utilization Summary
AI Tools Consulted:** ChatGPT / Claude Code Generation Architecture.
Features Built with AI Guidance:** Assisted in transitioning our imperative element tracking loops into standard React mapping functions, structuring clean `useState` form attachments, and embedding custom CSS overrides safely into modular files without breaking layout blocks.

 2. Technical Code Architecture Defense (How It Works)

A. The Paradigm Shift: Imperative vs. Declarative Architecture
Our original Midterm project relied on Imperative JavaScript. To add or remove items, the code had to query elements manually via `document.getElementById`, generate raw element structures via `document.createElement("tr")`, manually change layout text values via `.innerHTML`, and modify the DOM structural tree with `.appendChild()`.

This React refactor introduces a Declarative Programming Paradigm. The user interface updates implicitly whenever application memory blocks shift. We completely removed physical DOM selector queries from the runtime environment.

 B. Complete State Strategy (`useState`)
Instead of referencing tracking nodes, all core project data points are handled using explicit React hooks:
* `categories` (Array State): Stores our main data collection of active categories. Each category object gets a unique identifier (`id`), a custom category name (`name`), and a text description entry.
* `catName` / `catDesc` (String States): Hooks listening to text updates across form entry blocks. Instead of parsing physical element values, elements read values smoothly out of state memory channels instantly during input change hooks (`onChange`).

 C. React Rendering Integrity Metrics
Dynamic Node Keys: Row instances mapped from the structural elements array contain distinct `key={cat.id}` property handles. This allows the Virtual DOM to manage element positions accurately without re-rendering the full document structure.
Automated Computations (`categories.length`):** The badge tracking number is derived directly out of structural metadata elements (`{categories.length}`). This setup drops separate state increment/decrement calculations or element tracking counts (`tableBody.querySelectorAll("tr").length`), preventing bugs and keeping data values 100% accurate.
