import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const roots = ["app", "components", "lib"];
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const unsafeWidthClass = /(?<![A-Za-z0-9_-])(?:max-w|min-w)-(?:xs|sm|md|lg|xl)(?![A-Za-z0-9_-])/g;
const smallFixedHeight = /(?<![A-Za-z0-9_-])h-(?:8|9|10)(?![A-Za-z0-9_-])/;
const smallFixedWidth = /(?<![A-Za-z0-9_-])w-(?:8|9|10)(?![A-Za-z0-9_-])/;
const findings = [];

function literalClassName(attributes) {
  const attribute = attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.getText() === "className",
  );
  if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer) return null;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (
    ts.isJsxExpression(attribute.initializer)
    && attribute.initializer.expression
    && (ts.isStringLiteral(attribute.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(attribute.initializer.expression))
  ) {
    return attribute.initializer.expression.text;
  }
  return null;
}

function validateInteractiveTargets(filePath, source) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sourceFile);
      if (["button", "a", "Link"].includes(tag)) {
        const className = literalClassName(node.attributes);
        if (className && smallFixedHeight.test(className) && smallFixedWidth.test(className)) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          findings.push({
            filePath,
            line,
            value: `${tag} ar mazu fiksētu skārienmērķi`,
            hint: "Izmanto vismaz h-11 w-11 (44 px).",
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walk(filePath);
      continue;
    }

    if (!sourceExtensions.has(path.extname(entry.name))) continue;

    const source = await readFile(filePath, "utf8");
    source.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(unsafeWidthClass)) {
        findings.push({
          filePath,
          line: index + 1,
          value: match[0],
          hint: "Izmanto precīzu platumu, piemēram, max-w-[36rem].",
        });
      }
    });
    validateInteractiveTargets(filePath, source);
  }
}

for (const root of roots) await walk(root);

if (findings.length > 0) {
  console.error("UI validācija neizdevās: atrastas nedrošas izkārtojuma vai skārienmērķu klases.");
  for (const finding of findings) {
    console.error(`- ${finding.filePath}:${finding.line} — ${finding.value}. ${finding.hint}`);
  }
  process.exit(1);
}

console.log("UI validācija izdevās: nedrošas platuma klases un mazi fiksēti skārienmērķi nav atrasti.");
