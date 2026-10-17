# CLAUDE.md

## Deploying

- **Production is the Vercel project `dailynews`** (`prj_vaAHQZAJ4rNjIvWEJ8wP5r8WZGcU`, team
  `son-nl-420`). Vercel builds production automatically from the default branch,
  `claude/multilingual-news-aggregator-restart-0zy0qh`, so **merging a PR into it deploys**.
- **Standing authorization (owner, 2026-10-17).** When the owner asked for work to be shipped,
  Claude may, without a separate yes:
  - merge the PR into the default branch once it is open, not a draft, mergeable and every check
    has passed (none failing or pending);
  - deploy or promote to Vercel production (`vercel deploy --prod`, `vercel promote`), only from
    the default branch.
  Afterwards, confirm the production deployment is READY and the live site answers.
- **Stays with the owner:** environment variables, domains, deleting deployments or the project,
  and anything on Supabase or Stripe. `.claude/settings.json` makes these always prompt.
