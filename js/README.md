1. Why Vitest Does Not Work Well with Browser-Based Apps

Overview

Vitest is a fast and modern testing framework designed for JavaScript and TypeScript applications. However, when testing browser-based applications, such as those that rely on the document or window objects, Vitest can run into issues because it operates in a Node.js environment by default.

Why Vitest Fails with Browser-Based Apps

1. No Built-in DOM (Runs in Node.js)

Vitest runs in a Node.js environment, which does not provide access to browser-specific APIs like:

document

window

navigator

Since these objects only exist in the browser, trying to use them in a Vitest test will result in errors like:

`ReferenceError: document is not defined`

Use Vitests for js unit tests.

Solution: Use Playwright instead for e-to-e