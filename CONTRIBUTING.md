# Contributing to NovaBuilder

First off, thank you for considering contributing to NovaBuilder! It's people like you that make NovaBuilder such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported** by searching on GitHub under [Issues](https://github.com/Jefreesujit/nova-builder/issues).
- If you can't find an open issue addressing the problem, [open a new one](https://github.com/Jefreesujit/nova-builder/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- **Check if the enhancement has already been suggested.**
- Open a new issue which clearly describes the enhancement and why it would be useful.

### Pull Requests

1.  **Fork the repository** and create your branch from `main`.
2.  **Install dependencies** using `npm install`.
3.  **Create a `.env.local`** file based on `.env.example` and add your keys (Supabase, Gemini).
4.  **Make your changes.** If you've added code that should be tested, add tests.
5.  **Ensure the build passes** with `npm run build`.
6.  **Lint your code** using `npm run lint`.
7.  **Submit a pull request!**

## Style Guide

- We use **TypeScript** for all logic.
- We use **Tailwind CSS 4** for styling.
- Follow the existing code structure and naming conventions.
- Keep components small and focused.
- Add comments for complex logic.

## Developing Locally

```bash
# Clone the repo
git clone https://github.com/Jefreesujit/nova-builder.git

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Questions?

Feel free to open an issue or reach out to the maintainers.
