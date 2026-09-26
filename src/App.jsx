import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Box,
  Check,
  ChevronRight,
  CircleDot,
  CloudCog,
  Cpu,
  Database,
  FileText,
  HardDrive,
  Menu,
  Monitor,
  Search,
  ShieldCheck,
  TerminalSquare,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { documents, documentsByFile, documentsBySlug } from "./docsCatalog";
import { trackPageView } from "./analytics";

const layers = [
  { icon: HardDrive, label: "Storage", value: "External NVMe", meta: "Models, caches, corpus" },
  { icon: Cpu, label: "Inference", value: "Ollama + MLX", meta: "Local model runtime" },
  { icon: Monitor, label: "Interface", value: "Open WebUI", meta: "Interactive chat" },
  { icon: Bot, label: "Agent", value: "OpenClaw / Larry", meta: "Background execution" },
  { icon: Search, label: "Search", value: "SearXNG", meta: "Private web research" },
  { icon: Database, label: "Knowledge", value: "RAG layer", meta: "Integration unverified", planned: true },
];

const principles = [
  {
    number: "01",
    title: "Externalize the weight",
    text: "Model binaries and caches live on dedicated NVMe storage, leaving the internal SSD focused on the operating system and applications.",
    icon: HardDrive,
  },
  {
    number: "02",
    title: "Verify the baseline",
    text: "Inventories, smoke tests, recovery scripts, and known-good checkpoints turn a working setup into a repeatable one.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Route by role",
    text: "Different models serve different jobs. The workbench favors measured capability over using the largest model for every request.",
    icon: CloudCog,
  },
];

const milestones = [
  ["May 03", "Build initiated", "Hardware and storage architecture established."],
  ["May 12", "Baseline complete", "Storage, runtimes, benchmarks, and recovery verified."],
  ["May 28", "Agent online", "OpenClaw agent Larry joined the local stack."],
  ["May 30", "Strict benchmark", "Six Ollama models tested against a fixed prompt set."],
  ["Next", "RAG corpus", "Governed retrieval remains planned; Qdrant is recorded in later snapshots.", true],
];

const docsGroups = [...new Set(documents.map(({ group }) => group))];

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#top");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#top");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}

function MarkdownLink({ href = "", children, ...props }) {
  const fileName = href.split("#")[0].replace(/^\.\//, "");
  const publicDocument = documentsByFile.get(fileName);

  if (publicDocument) {
    const fragment = href.includes("#") ? `#${href.split("#")[1]}` : "";
    return <a href={`#/docs/${publicDocument.slug}${fragment}`} {...props}>{children}</a>;
  }

  if (/^(https?:|mailto:)/.test(href)) {
    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
  }

  return (
    <a
      href={`https://github.com/OKHP3/mac-studio-local-ai-workbench/blob/main/docs/${href.replace(/^\.\//, "")}`}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

function DocsPage({ slug }) {
  const activeDocument = documentsBySlug.get(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <a className="brand" href="#top" aria-label="Return to workbench home">
          <img className="brand-mark-image" src={`${import.meta.env.BASE_URL}brand-mark.svg`} alt="" />
          <span className="brand-copy"><strong>LOCAL AI</strong><span>DOCUMENTATION / 01</span></span>
        </a>
        <a className="docs-home-link" href="#top">Workbench overview <ArrowUpRight size={15} /></a>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          <div className="docs-sidebar-heading">
            <span className="kicker">PUBLIC FIELD MANUAL</span>
            <div className="docs-sidebar-title">Workbench docs</div>
            <p>Curated architecture notes, operating guides, and dated project records.</p>
          </div>
          <nav>
            {docsGroups.map((group) => (
              <div className="docs-nav-group" key={group}>
                <h2>{group}</h2>
                {documents.filter((item) => item.group === group).map((item) => (
                  <a className={activeDocument?.slug === item.slug ? "is-current" : ""} href={`#/docs/${item.slug}`} key={item.slug}>
                    <span>{item.title}</span>
                    {item.snapshotDate && <small>{item.snapshotDate}</small>}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="docs-main" id="docs-main" tabIndex="-1">
          {activeDocument ? (
            <>
              <div className="doc-masthead">
                <span className="kicker">{activeDocument.group} / DOCUMENT {String(documents.indexOf(activeDocument) + 1).padStart(2, "0")}</span>
                <h1>{activeDocument.title}</h1>
                <p>{activeDocument.summary}</p>
                {activeDocument.snapshotDate && (
                  <div className="snapshot-notice" role="note">
                    <FileText size={18} />
                    <div><strong>Historical snapshot</strong><span>Recorded {activeDocument.snapshotDate}. This is a dated project record, not live system telemetry.</span></div>
                  </div>
                )}
              </div>
              <article className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
                  {activeDocument.content}
                </ReactMarkdown>
              </article>
              <nav className="doc-pagination" aria-label="Adjacent documents">
                {documents[documents.indexOf(activeDocument) - 1] ? (
                  <a href={`#/docs/${documents[documents.indexOf(activeDocument) - 1].slug}`}><span>Previous</span>{documents[documents.indexOf(activeDocument) - 1].title}</a>
                ) : <span />}
                {documents[documents.indexOf(activeDocument) + 1] && (
                  <a className="doc-pagination-next" href={`#/docs/${documents[documents.indexOf(activeDocument) + 1].slug}`}><span>Next</span>{documents[documents.indexOf(activeDocument) + 1].title}</a>
                )}
              </nav>
            </>
          ) : (
            <div className="docs-index">
              <span className="kicker">DOCUMENTATION / INDEX</span>
              <h1>The full field manual.</h1>
              <p>Browse the public-safe records behind the workbench. Dated assessments are separated from current guides and clearly marked as historical snapshots.</p>
              <div className="docs-index-grid">
                {documents.map((item) => (
                  <a href={`#/docs/${item.slug}`} key={item.slug}>
                    <small>{item.group}</small><h2>{item.title}</h2><p>{item.summary}</p>
                    <span>{item.snapshotDate || "Open guide"} <ChevronRight size={15} /></span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hash = useHashRoute();
  const docsMatch = hash.match(/^#\/docs(?:\/([^#]+))?/);
  const activeDocument = docsMatch?.[1] ? documentsBySlug.get(docsMatch[1]) : undefined;
  const pageTitle = activeDocument
    ? `${activeDocument.title} | Local AI Workbench`
    : docsMatch
      ? "Workbench Documentation | Mac Studio Local AI Workbench"
      : "Mac Studio Local AI Workbench | OverKill Hill P³";
  const pageDescription = activeDocument?.summary
    || (docsMatch
      ? "Public architecture notes, operating guides, and dated project records for the Mac Studio Local AI Workbench."
      : "A documented, benchmarked, and recoverable local AI workbench built on Apple Silicon.");
  const pagePath = `${window.location.pathname}${docsMatch ? `#/docs${activeDocument ? `/${activeDocument.slug}` : ""}` : ""}`;

  useEffect(() => {
    document.title = pageTitle;
    const setMeta = (selector, attributes, content) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        Object.entries(attributes).forEach(([name, value]) => tag.setAttribute(name, value));
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMeta('meta[name="description"]', { name: "description" }, pageDescription);
    setMeta('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    setMeta('meta[property="og:description"]', { property: "og:description" }, pageDescription);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, pageDescription);
  }, [pagePath, pageTitle, pageDescription]);

  useEffect(() => {
    trackPageView(pagePath, pageTitle);
  }, [pagePath, pageTitle]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  if (docsMatch) {
    return <DocsPage slug={docsMatch[1]} />;
  }

  return (
    <div className="site-shell">
      <header className={`topbar ${scrolled ? "topbar--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Mac Studio Local AI Workbench home">
          <img className="brand-mark-image" src={`${import.meta.env.BASE_URL}brand-mark.svg`} alt="" />
          <span className="brand-copy">
            <strong>LOCAL AI</strong>
            <span>WORKBENCH / 01</span>
          </span>
        </a>
        <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Primary navigation">
          {["Architecture", "Method", "Benchmarks", "Roadmap"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>
          ))}
          <a href="#/docs" onClick={closeMenu}>Docs</a>
          <a className="nav-source" href="https://github.com/OKHP3/mac-studio-local-ai-workbench" target="_blank" rel="noreferrer">
            <TerminalSquare size={16} /> Source
          </a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
          <div className="hero-content">
            <div className="eyebrow reveal"><span className="status-dot" /> May 2026 baseline · Agent documented online</div>
            <h1 className="reveal reveal--2">Local AI.<br /><span>Built to hold.</span></h1>
            <p className="hero-lede reveal reveal--3">
              A Mac Studio M4 Max transformed into a governed AI workbench: externalized,
              benchmarked, recoverable, and ready for autonomous work.
            </p>
            <div className="hero-actions reveal reveal--4">
              <a className="button button--primary" href="#architecture">Explore the system <ArrowDown size={17} /></a>
              <a className="button button--ghost" href="#/docs"><FileText size={17} /> Read the docs</a>
              <a className="button button--ghost" href="https://github.com/OKHP3/mac-studio-local-ai-workbench" target="_blank" rel="noreferrer">View repository <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <div className="hero-spec reveal reveal--4">
            <div><span>HOST</span><strong>Mac Studio</strong></div>
            <div><span>SILICON</span><strong>M4 Max</strong></div>
            <div><span>MEMORY</span><strong>36 GB</strong></div>
            <div><span>LOCAL MODELS</span><strong>29</strong></div>
          </div>
        </section>

        <section className="section architecture" id="architecture">
          <div className="section-heading">
            <div><span className="kicker">SYSTEM / ARCHITECTURE</span><h2>One machine.<br />Two ways to work.</h2></div>
            <p>Interactive chat when a person is present. Autonomous execution when they are not. Both run over the same governed local foundation.</p>
          </div>

          <div className="interaction-pair">
            <article className="interaction-card interaction-card--chat">
              <div className="card-topline"><span>01 / SYNCHRONOUS</span><Monitor size={19} /></div>
              <div><h3>Open WebUI</h3><p>You prompt. A local model responds.</p></div>
              <div className="terminal-line"><span>$</span> ask the workbench <i className="cursor" /></div>
            </article>
            <div className="pair-junction"><Zap size={19} /></div>
            <article className="interaction-card interaction-card--agent">
              <div className="card-topline"><span>02 / ASYNCHRONOUS</span><Bot size={19} /></div>
              <div><h3>Larry / OpenClaw</h3><p>Schedules, searches, organizes, and acts in the background.</p></div>
              <div className="agent-status"><span><CircleDot size={14} /> AGENT ACTIVE</span><strong>gemma3:27b</strong></div>
            </article>
          </div>

          <div className="stack-map">
            <div className="stack-spine" aria-hidden="true" />
            {layers.map(({ icon: Icon, label, value, meta, planned }, index) => (
              <article className={`stack-node ${planned ? "stack-node--planned" : ""}`} key={label}>
                <span className="node-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="node-icon"><Icon /></span>
                <div><small>{label}</small><h3>{value}</h3><p>{meta}</p></div>
                <span className="node-state">{planned ? "PLANNED" : <Check size={16} />}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section method" id="method">
          <div className="section-heading section-heading--light">
            <div><span className="kicker">OPERATING MODEL</span><h2>Not a pile<br />of downloads.</h2></div>
            <p>The system is designed around operational trust: explicit paths, known roles, repeatable checks, and recovery when something changes.</p>
          </div>
          <div className="principle-grid">
            {principles.map(({ number, title, text, icon: Icon }) => (
              <article className="principle" key={number}>
                <div className="principle-head"><span>{number}</span><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="principle-rule" />
              </article>
            ))}
          </div>
        </section>

        <section className="section benchmark" id="benchmarks">
          <div className="benchmark-intro">
            <span className="kicker">MEASURED / MAY 30, 2026</span>
            <h2>Capability,<br />not assumption.</h2>
            <p>Six Ollama models faced the same strict five-prompt suite. Two completed every task successfully.</p>
            <a href="https://github.com/OKHP3/mac-studio-local-ai-workbench/tree/main/benchmarks" target="_blank" rel="noreferrer">Read benchmark source <ChevronRight size={16} /></a>
          </div>
          <div className="scoreboard">
            <div className="scoreboard-header"><span>STRICT SCORE</span><span>5 TASKS</span></div>
            {[
              ["gemma3:12b", 5, "100%"],
              ["gemma3:27b", 5, "100%"],
              ["mistral-small3.1:24b", 4, "80%"],
              ["phi4:14b", 3, "60%"],
            ].map(([model, score, percent], index) => (
              <div className="score-row" key={model}>
                <span className="score-rank">0{index + 1}</span>
                <strong>{model}</strong>
                <span className="score-bar"><i style={{ "--score": `${score * 20}%` }} /></span>
                <b>{score}/5</b>
                <small>{percent}</small>
              </div>
            ))}
            <p className="score-note">Representative highlights. See repository artifacts for methodology and full recorded results.</p>
          </div>
        </section>

        <section className="section roadmap" id="roadmap">
          <div className="roadmap-title"><span className="kicker">BUILD LOG / ROADMAP</span><h2>From workstation<br />to workbench.</h2></div>
          <div className="timeline">
            {milestones.map(([date, title, text, planned], index) => (
              <article className={planned ? "milestone milestone--planned" : "milestone"} key={title}>
                <span className="milestone-dot">{planned ? <Box size={16} /> : <Check size={15} />}</span>
                <div className="milestone-date">{date}</div>
                <div><h3>{title}</h3><p>{text}</p></div>
                <span className="milestone-number">{String(index + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="closing">
          <TerminalSquare size={30} />
          <span className="kicker">THE DOCUMENTED BASELINE</span>
          <h2>The foundation is documented.<br /><span>The next layer is knowledge.</span></h2>
          <p>The May 2026 baseline records a functional, governed, benchmarked, and recoverable workbench. Read the dated documentation for subsequent changes. Host availability and end-to-end RAG remain separate verification tasks.</p>
          <div className="closing-actions">
            <a className="button button--primary" href="https://github.com/OKHP3/mac-studio-local-ai-workbench" target="_blank" rel="noreferrer"><TerminalSquare size={17} /> Explore on GitHub</a>
            <a className="button button--ghost-light" href="https://overkillhill.com/projects/mac-studio-local-ai-workbench/" target="_blank" rel="noreferrer">Project archive <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img className="brand-mark-image" src={`${import.meta.env.BASE_URL}brand-mark.svg`} alt="" /><p>Built by <a href="https://overkillhill.com">OverKill Hill P³</a><br />Protocol-driven systems that last.</p></div>
        <div className="footer-meta"><span>PUBLIC ARTIFACT / 2026</span><span>SANITIZED · DOCUMENTED · RECOVERABLE</span></div>
      </footer>
    </div>
  );
}

export default App;
