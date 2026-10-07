# Editorial review and merge

Use this process for changes to the public filecoin.io website. A green check means the change meets machine-checkable rules; a reviewer still checks facts, voice, links in context, and the preview.

## For editors

1. Create a branch and open a pull request to `main`. Use a draft PR while the copy is still being written.
2. In the PR description, identify the pages changed, the source for factual claims, and anything a reviewer should inspect. For translations, name the source page and translator or reviewer.
3. Wait for **Content quality**, **Code style**, **Dependency review**, the existing Markdown check, and the site build/Cypress check. Open the Vercel preview and inspect desktop and mobile layouts, images, links, and metadata.
4. Ask a human editor to review wording and claims. Ask a site maintainer to review changes to code, dependencies, configuration, automation, or deployment behavior.
5. Resolve feedback, then use GitHub **Enable auto-merge** (squash) when the review is approved. GitHub merges only after required checks and reviews pass.

## What the checks cover

**Content quality** examines changed Markdown under `apps/filecoin-site/content/`. It checks parseable frontmatter, required blog fields, valid CMS categories, local image references, and obvious executable markup. Long excerpts and missing header image alt text produce review warnings. The existing Markdown workflow checks Markdown style; the scheduled link checker catches link rot. **Dependency review** blocks newly introduced high or critical severity vulnerable dependencies. The existing site workflow builds the site and runs Cypress, with Percy on non-CMS branches.

**Code style** checks dependency version consistency and Prettier formatting for changed code and configuration. These checks cannot verify whether a claim is true, a translation is accurate, an image is licensed, or the result looks right in the preview. The reviewer should check these directly. A content PR should not receive automatic bot approval based only on checks.

## Repository settings for maintainers

After this workflow has run once, create or update the `main` ruleset:

- Require a pull request and one approving review. Dismiss stale approvals after new commits.
- Require **Content quality**, **Code style**, **Dependency review**, the existing site Cypress check, and the Markdown check. Confirm the exact check names in the Actions tab before saving the ruleset.
- Enable code owner review after assigning actual people or teams in `CODEOWNERS`; do not add placeholder owners. Cover `.github/`, `scripts/`, `packages/`, app source/configuration, and content with appropriate owners.
- Do not allow bypass by ordinary contributors. Restrict workflow and repository settings changes to maintainers.
- Enable **Allow auto-merge** in repository settings. Editors with write access can then opt in on an approved PR. Keep squash merge enabled for a readable content history.
- Enable secret scanning push protection. Review whether CodeQL default setup is enabled for TypeScript/JavaScript and GitHub Actions.

GitHub auto-merge waits for protection rules; it does not replace an approving review. For Dependabot PRs, maintainers can opt in to auto-merge after the same checks and any required review. Avoid automatic approval or merge for content, workflow, and dependency changes until a separate, narrow policy is agreed and tested.
