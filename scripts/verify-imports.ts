/**
 * Import Verification Script
 *
 * This script verifies that all imports in the project resolve correctly
 * after restructuring. Run this after each file move to catch broken imports.
 *
 * Usage:
 *   tsx scripts/verify-imports.ts
 *   or
 *   npm run verify-imports
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

interface ImportIssue {
  file: string;
  line: number;
  importPath: string;
  issue: string;
}

const issues: ImportIssue[] = [];
const srcDir = path.join(process.cwd(), "src");

/**
 * Check if a file exists at the given path
 */
function fileExists(filePath: string): boolean {
  const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

  // Check exact path
  if (fs.existsSync(filePath)) {
    return true;
  }

  // Check with extensions
  for (const ext of extensions) {
    if (fs.existsSync(filePath + ext)) {
      return true;
    }
  }

  // Check index files
  for (const ext of extensions) {
    const indexPath = path.join(filePath, "index" + ext);
    if (fs.existsSync(indexPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolve import path relative to the importing file
 */
function resolveImportPath(
  importPath: string,
  fromFile: string
): string | null {
  // Handle alias imports (@/)
  if (importPath.startsWith("@/")) {
    return path.join(srcDir, importPath.slice(2));
  }

  // Handle relative imports
  if (importPath.startsWith(".")) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
  }

  // Node modules or external packages - skip verification
  return null;
}

/**
 * Extract import statements from a file
 */
function extractImports(
  filePath: string
): Array<{ line: number; path: string }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const imports: Array<{ line: number; path: string }> = [];

  lines.forEach((line, index) => {
    // Match: import { ... } from "path"
    // Match: import path from "path"
    // Match: import "path"
    const importMatch = line.match(
      /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/
    );

    if (importMatch) {
      imports.push({
        line: index + 1,
        path: importMatch[1],
      });
    }
  });

  return imports;
}

/**
 * Verify all imports in a file
 */
function verifyFileImports(filePath: string): void {
  const imports = extractImports(filePath);

  imports.forEach(({ line, path: importPath }) => {
    const resolvedPath = resolveImportPath(importPath, filePath);

    // Skip external packages
    if (!resolvedPath) {
      return;
    }

    // Check if file exists
    if (!fileExists(resolvedPath)) {
      issues.push({
        file: filePath.replace(process.cwd(), "").replace(/\\/g, "/"),
        line,
        importPath,
        issue: `File not found: ${resolvedPath
          .replace(process.cwd(), "")
          .replace(/\\/g, "/")}`,
      });
    }
  });
}

/**
 * Main verification function
 */
async function verifyAllImports(): Promise<void> {
  console.log("🔍 Starting import verification...\n");

  // Find all TypeScript/JavaScript files
  const files = await glob("src/**/*.{ts,tsx,js,jsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/*.d.ts"],
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`📁 Found ${files.length} files to check\n`);

  // Verify each file
  let checkedFiles = 0;
  files.forEach((file) => {
    verifyFileImports(file);
    checkedFiles++;

    // Progress indicator
    if (checkedFiles % 50 === 0) {
      console.log(`   Checked ${checkedFiles}/${files.length} files...`);
    }
  });

  // Report results
  console.log(`\n✅ Checked ${files.length} files\n`);

  if (issues.length === 0) {
    console.log("✨ All imports are valid! No issues found.\n");
    process.exit(0);
  } else {
    console.log(`❌ Found ${issues.length} import issue(s):\n`);

    // Group issues by file
    const issuesByFile = issues.reduce((acc, issue) => {
      if (!acc[issue.file]) {
        acc[issue.file] = [];
      }
      acc[issue.file].push(issue);
      return acc;
    }, {} as Record<string, ImportIssue[]>);

    // Print issues
    Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
      console.log(`📄 ${file}`);
      fileIssues.forEach((issue) => {
        console.log(`   Line ${issue.line}: import "${issue.importPath}"`);
        console.log(`   ⚠️  ${issue.issue}\n`);
      });
    });

    process.exit(1);
  }
}

// Run verification
verifyAllImports().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exit(1);
});
