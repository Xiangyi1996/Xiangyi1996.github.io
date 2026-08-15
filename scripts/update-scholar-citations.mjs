import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const scholarProfile =
  "https://scholar.google.com/citations?hl=en&user=OAQH4bQAAAAJ";
const homepagePath = new URL("../index.html", import.meta.url);
const browserUserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const run = promisify(execFile);

async function fetchScholarHtml() {
  // Node does not use HTTPS_PROXY by default. curl is available on both the
  // GitHub runner and macOS, so prefer it in proxied environments.
  if (process.env.HTTPS_PROXY || process.env.https_proxy) {
    const { stdout } = await run(
      "curl",
      [
        "--fail",
        "--location",
        "--compressed",
        "--silent",
        "--show-error",
        "--max-time",
        "20",
        "--retry",
        "2",
        "--retry-all-errors",
        "--user-agent",
        browserUserAgent,
        scholarProfile,
      ],
      { maxBuffer: 2 * 1024 * 1024 },
    );
    return stdout;
  }

  const response = await fetch(scholarProfile, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": browserUserAgent,
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Google Scholar returned HTTP ${response.status}`);
  }

  return response.text();
}

const scholarHtml = await fetchScholarHtml();
const citationsMatch =
  scholarHtml.match(/Cited by\s+([\d,]+)/i) ??
  scholarHtml.match(/<td class="gsc_rsb_std">([\d,]+)<\/td>/i);

if (!citationsMatch) {
  throw new Error(
    "Could not find the total citation count in the Google Scholar page.",
  );
}

const citations = Number.parseInt(citationsMatch[1].replaceAll(",", ""), 10);

if (!Number.isSafeInteger(citations) || citations < 0) {
  throw new Error(`Invalid Google Scholar citation count: ${citationsMatch[1]}`);
}

const homepage = await readFile(homepagePath, "utf8");
const citationElement =
  /(<dd id="scholar-citations">)([\d,]+)(<\/dd>)/;

if (!citationElement.test(homepage)) {
  throw new Error('Could not find <dd id="scholar-citations"> in index.html.');
}

const formattedCitations = new Intl.NumberFormat("en-US").format(citations);
const updatedHomepage = homepage.replace(
  citationElement,
  `$1${formattedCitations}$3`,
);

if (updatedHomepage === homepage) {
  console.log(`Google Scholar citations are unchanged at ${formattedCitations}.`);
} else {
  await writeFile(homepagePath, updatedHomepage);
  console.log(`Updated Google Scholar citations to ${formattedCitations}.`);
}
