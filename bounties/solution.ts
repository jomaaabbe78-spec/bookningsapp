import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Fixes the typo "Welcom" → "Welcome" in the project's README.md file.
 *
 * Usage:
 *   ts-node fixReadme.ts   // or compile and run with node
 */
async function fixReadme(): Promise<void> {
  const readmePath = path.resolve(__dirname, 'README.md');

  try {
    // Read the current contents of README.md
    const originalContent = await fs.readFile(readmePath, 'utf-8');

    // Replace all occurrences of the typo (case‑sensitive)
    const fixedContent = originalContent.replace(/Welcom\b/g, 'Welcome');

    // Only write back if a change was made
    if (fixedContent !== originalContent) {
      await fs.writeFile(readmePath, fixedContent, 'utf-8');
      console.log('✅ README.md typo fixed successfully.');
    } else {
      console.log('ℹ️ No typo found. README.md is already correct.');
    }
  } catch (err) {
    console.error('❌ Failed to process README.md:', err);
    process.exit(1);
  }
}

// Execute the fix when the script is run directly
if (require.main === module) {
  fixReadme();
}