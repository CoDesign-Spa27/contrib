GET /repos/{owner}/{repo}/commits — overview and usage

What it does

Lists commits in a repository (default: repository’s default branch).
Authentication & tokens

Works without authentication for public repos.
For fine‑grained tokens use: GitHub App user access tokens, GitHub App installation access tokens, or fine‑grained personal access tokens with the repository "Contents" permission (read).
Request

Method: GET
URL: https://api.github.com/repos/{owner}/{repo}/commits
Recommended header: Accept: application/vnd.github+json
If authenticating add: Authorization: Bearer <YOUR-TOKEN> and X-GitHub-Api-Version: 2022-11-28
Query parameters

sha — SHA or branch to start listing from (default: default branch).
path — return only commits that touch this file path.
author — GitHub username or email to filter by commit author.
committer — GitHub username or email to filter by committer.
since / until — ISO 8601 timestamps to limit commits by date (between 1970-01-01 and 2099-12-31).
per_page — results per page (max 100, default 30).
page — page number (default 1).
Response highlights

Status codes: 200 (OK), 400, 404, 409, 500.
Each commit object includes a verification object:
verified (boolean)
reason (string) — e.g. valid, unsigned, unknown_key, no_user, unverified_email, etc.
signature, payload, verified_at
Large diffs: when requesting default JSON, if a commit diff has >300 files the response includes pagination for remaining files (limit 3000).
Example cURL curl -L
-H "Accept: application/vnd.github+json"
-H "Authorization: Bearer <YOUR-TOKEN>"
-H "X-GitHub-Api-Version: 2022-11-28"
https://api.github.com/repos/OWNER/REPO/commits

Pagination

Use per_page and page or follow Link headers. See "Using pagination in the REST API" for details.