<img loading="lazy" decoding="async" width="250px" src="https://neon.tech/brand/neon-logo-dark-color.svg" alt="Neon Logo" />

# Instant Search at Scale — Powered by Neon Postgres & ParadeDB's pg_search

<p>
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#one-click-deploy"><strong>One-click Deploy</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>

## Introduction

This search experience is built on <b>Postgres</b>, hosting over <b>50 million records</b> while ensuring <b>fast and efficient search</b> using ParadeDB's <b>pg_search</b>. pg_search leverages Postgres indexes to enable near-instantaneous search results, even across large datasets.

## Setup

#### Serverless Postgres (Neon)

1. Sign up or log in to your account on Neon.
2. Create a new database (or select an existing one).
3. Navigate to the database settings to find your connection string, which will be your `DATABASE_URL`.
4. Go to your GitHub repository.
5. Click on **Settings** in the repository menu.
6. In the left sidebar, click on **Secrets and variables** and then **Actions**.
7. Click on the **New repository secret** button.
8. Add a new secret with the name `DATABASE_URL` and paste your database URL as the value.

## One-click Deploy

You can deploy this template to Vercel/Netlify/Render with the buttons below:

<div>
    <a target="_blank" href="https://deploy.workers.cloudflare.com/?url=https://github.com/neondatabase-labs/postgres-open-library-search">
        <img src="https://deploy.workers.cloudflare.com/button" width="146.4" height="31.2" />
    </a>
    <a href="https://vercel.com/new/clone?repository-url=https://github.com/neondatabase-labs/postgres-open-library-search&env=DATABASE_URL" target="_blank">
        <img src="https://vercel.com/button" width="103" height="32" />
    </a>
    <a href="https://app.netlify.com/start/deploy?repository=https://github.com/neondatabase-labs/postgres-open-library-search#DATABASE_URL" target="_blank">
        <img src="https://www.netlify.com/img/deploy/button.svg" width="179" height="32" style="height: 30px; width: auto;" />
    </a>
    <a href="https://render.com/deploy?repo=https://github.com/neondatabase-labs/postgres-open-library-search" target="_blank">
        <img src="https://render.com/images/deploy-to-render-button.svg" width="153" height="40" style="height: 30px; width: auto;" />
    </a>
</div>

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience.

### Platforms

#### (Postgres) Database

- [Neon](https://neon.tech) – A serverless database platform that provides instant scalability and high performance for your applications, allowing you to focus on building without worrying about infrastructure.
    - [pg_search](https://www.paradedb.com/blog/introducing_search) – A powerful search extension for PostgreSQL that enables advanced search capabilities using the BM25 algorithm.

#### Deployment

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git.
- [Netlify](https://netlify.com/) – A platform that simplifies the deployment process and provides continuous integration for your projects.
- [Render](https://render.com/) – A cloud platform that offers instant deployment and automatic scaling for web applications.

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development.

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety.
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style.

## Author

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))
