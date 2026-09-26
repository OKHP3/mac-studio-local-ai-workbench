const markdownFiles = import.meta.glob("../docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const publicDocuments = [
  { file: "00-project-overview.md", slug: "project-overview", title: "Project overview", group: "Start here", summary: "Purpose, scope, and the workbench at a glance." },
  { file: "01-build-journey.md", slug: "build-journey", title: "Build journey", group: "Start here", summary: "How the workstation became a governed local AI system." },
  { file: "06-definition-of-done.md", slug: "definition-of-done", title: "Definition of done", group: "Start here", summary: "The checks used to decide when the baseline was complete." },
  { file: "02-storage-architecture.md", slug: "storage-architecture", title: "Storage architecture", group: "Architecture", summary: "External volumes, model storage, caches, and recovery boundaries." },
  { file: "03-toolchain.md", slug: "toolchain", title: "Toolchain", group: "Architecture", summary: "The software layers and the role each one serves." },
  { file: "04-model-inventory.md", slug: "model-inventory", title: "Model inventory", group: "Architecture", summary: "Available local models and their intended roles." },
  { file: "12-architecture-diagrams.md", slug: "architecture-diagrams", title: "Architecture diagrams", group: "Architecture", summary: "System maps for storage, inference, interfaces, and agents." },
  { file: "diagram-architecture.md", slug: "system-architecture-diagram", title: "System architecture diagram", group: "Architecture", summary: "The canonical C4-style structural view and its Mermaid source." },
  { file: "diagram-flowchart.md", slug: "system-flowchart", title: "System flowchart", group: "Architecture", summary: "The canonical work-routing flowchart and its Mermaid source." },
  { file: "diagram-mindmap.md", slug: "system-mind-map", title: "System mind map", group: "Architecture", summary: "The canonical system mind map and its Mermaid source." },
  { file: "05-benchmark-results.md", slug: "benchmark-results", title: "Benchmark results", group: "Evaluation", summary: "Recorded model results from a fixed prompt suite.", snapshotDate: "May 30, 2026" },
  { file: "08-council-of-ais-methodology.md", slug: "council-of-ais", title: "Council of AIs methodology", group: "Evaluation", summary: "A repeatable method for multi-model review and synthesis." },
  { file: "09-token-economics.md", slug: "token-economics", title: "Token economics", group: "Evaluation", summary: "Practical context for model size, throughput, and cost." },
  { file: "07-rag-roadmap.md", slug: "rag-roadmap", title: "RAG roadmap", group: "Guides", summary: "The planned path from a local stack to governed retrieval." },
  { file: "10-openclaw-larry-agent.md", slug: "openclaw-larry", title: "OpenClaw / Larry agent", group: "Guides", summary: "The background agent layer, responsibilities, and controls." },
  { file: "11-build-your-own-local-ai.md", slug: "build-your-own", title: "Build your own local AI", group: "Guides", summary: "A practical guide for adapting the workbench pattern." },
  { file: "15-technology-version-management.md", slug: "version-management", title: "Technology version management", group: "Guides", summary: "How the project tracks upstream tools without chasing every release." },
  { file: "local-web-portal-https.md", slug: "local-web-portal-https", title: "Local web portal and HTTPS", group: "Guides", summary: "A future architecture for a private portal and HTTPS front door." },
  { file: "publication-boundary.md", slug: "publication-boundary", title: "Publication boundary", group: "Project governance", summary: "What belongs in this public artifact and what must remain private." },
  { file: "16-local-ai-stack-readiness-research-2026-08-02.md", slug: "stack-readiness-2026-08-02", title: "Local AI stack readiness research", group: "Historical records", summary: "A dated research snapshot of stack readiness.", snapshotDate: "August 2, 2026" },
  { file: "16-openclaw-readiness-and-local-to-cloud-ai-pipeline-2026-08-02.md", slug: "openclaw-readiness-2026-08-02", title: "OpenClaw readiness and pipeline", group: "Historical records", summary: "A dated assessment of agent and local-to-cloud readiness.", snapshotDate: "August 2, 2026" },
  { file: "17-openclaw-hardening-handoff-2026-08-02.md", slug: "openclaw-hardening-2026-08-02", title: "OpenClaw hardening handoff", group: "Historical records", summary: "A dated handoff record for hardening work.", snapshotDate: "August 2, 2026" },
  { file: "18-lan-exposure-fix-2026-09-12.md", slug: "lan-exposure-fix-2026-09-12", title: "LAN exposure fix", group: "Historical records", summary: "A dated record of the LAN exposure correction.", snapshotDate: "September 12, 2026" },
];

function prepareMarkdown(source = "") {
  return source
    .replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n)+/, "")
    .replace(/^#\s+.+\r?\n+/, "");
}

export const documents = publicDocuments.map((document) => ({
  ...document,
  content: prepareMarkdown(markdownFiles[`../docs/${document.file}`]),
}));

export const documentsBySlug = new Map(documents.map((document) => [document.slug, document]));
export const documentsByFile = new Map(documents.map((document) => [document.file, document]));