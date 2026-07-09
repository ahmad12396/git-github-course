const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const commandDetails = [
  ["git init", "Create a new local repository", "git init", "Initializes the hidden .git database in the current folder.", "Initialized empty Git repository in /project/.git/", "Running it in the wrong folder creates history around the wrong files.", "Use once at the root of a new project."],
  ["git status", "Inspect current state", "git status", "Shows branch, staged files, unstaged files, and untracked files.", "On branch main\nChanges not staged for commit:\n  modified: index.html", "Ignoring status before commit often causes missing files.", "Run before and after every important command."],
  ["git add", "Stage selected files", "git add index.html", "Moves a file from working directory into the staging area.", "", "Staging a generated or secret file by accident.", "Stage related files only, then commit a single idea."],
  ["git add .", "Stage all visible changes", "git add .", "Stages new, modified, and deleted files below the current directory.", "", "Using it without checking status can include junk files.", "Good after reviewing changes with git diff and .gitignore."],
  ["git commit", "Save a snapshot", "git commit", "Opens an editor to write a commit message for staged changes.", "[main a1b2c3d] Add homepage\n 2 files changed", "Committing unrelated work together.", "Commit small, reviewable units."],
  ["git commit -m", "Save with inline message", "git commit -m \"Add login form\"", "Creates a commit and supplies the message directly with -m.", "[main 2f9ab21] Add login form", "Messages like update, final, fixed.", "Use imperative messages: Add, Fix, Refactor, Document."],
  ["git log", "Read detailed history", "git log", "Shows commits, authors, dates, and messages.", "commit 2f9ab21\nAuthor: Ayesha\nDate: ...", "Forgetting q exits the pager.", "Use before debugging or releasing."],
  ["git log --oneline", "Read compact history", "git log --oneline", "Shows short hashes and one-line messages.", "2f9ab21 Add login form", "Relying on short hashes in scripts.", "Great for choosing commits for reset, revert, or cherry-pick."],
  ["git diff", "Inspect unstaged changes", "git diff", "Compares working directory against staging area.", "- old line\n+ new line", "Reading huge diffs too late.", "Review before staging to avoid surprises."],
  ["git restore", "Discard or unstage changes", "git restore index.html", "Restores a file from HEAD unless a source is provided.", "", "Discarding work that was not committed.", "Use for local mistakes after confirming with diff."],
  ["git reset", "Move branch or unstage", "git reset HEAD index.html", "Changes what commit a branch points to or removes files from staging.", "", "Hard reset can erase uncommitted work.", "Prefer --soft or mixed unless you truly need --hard."],
  ["git rm", "Remove tracked files", "git rm old.js", "Deletes a file and stages the deletion.", "rm 'old.js'", "Deleting manually then forgetting to stage deletion.", "Use when a tracked file should leave the project."],
  ["git mv", "Rename tracked files", "git mv app.js main.js", "Renames or moves a tracked file and stages the change.", "", "Renaming plus editing can make review harder.", "Rename separately from content edits."],
  ["git show", "Inspect one commit/object", "git show HEAD", "Displays a commit, tag, or object with metadata and diff.", "commit 2f9ab21\nAuthor: ...", "Using it on the wrong hash.", "Use in review to understand exactly what changed."],
  ["git stash", "Temporarily shelve work", "git stash", "Stores dirty working changes away so the branch becomes clean.", "Saved working directory and index state WIP on main", "Stashing repeatedly without names.", "Use git stash push -m \"message\" for clarity."],
  ["git stash pop", "Restore latest stash", "git stash pop", "Applies latest stash and removes it from stash list.", "", "Conflicts can happen when code moved on.", "Use git stash apply when you want to keep the stash."],
  ["git clean", "Remove untracked files", "git clean -fd", "Deletes untracked files and directories.", "Removing temp/", "Dangerous because untracked work is not recoverable by Git.", "Preview with git clean -fdn first."],
  ["git reflog", "Recover moved references", "git reflog", "Shows where HEAD and branches recently pointed.", "HEAD@{0}: reset: moving to HEAD~1", "Waiting too long; reflog expires eventually.", "Life-saver after accidental reset or rebase."],
  ["git tag", "Mark a release point", "git tag v1.0.0", "Creates a named reference to a commit.", "", "Moving public tags breaks trust.", "Use annotated tags for releases: git tag -a v1.0.0 -m \"Release\"."],
  ["git blame", "Find line history", "git blame app.js", "Shows the commit and author for each line.", "a1b2c3d (Ali 2026-07-09) const app = ...", "Using blame to assign fault instead of context.", "Use respectfully to learn why code exists."],
  ["git branch", "List or create branches", "git branch feature/login", "Creates a branch pointer or lists local branches.", "* main\n  feature/login", "Creating branches but never switching to them.", "Name branches by work type and scope."],
  ["git checkout", "Switch or restore", "git checkout feature/login", "Older command for switching branches and restoring files.", "", "It does multiple jobs, which confuses beginners.", "Know it because legacy tutorials use it."],
  ["git switch", "Switch branches", "git switch feature/login", "Modern command dedicated to branch switching.", "", "Switching with uncommitted conflicting changes.", "Prefer it for branch movement."],
  ["git checkout -b", "Create and switch branch", "git checkout -b feature/login", "Creates a new branch and immediately checks it out.", "Switched to a new branch 'feature/login'", "Branching from the wrong base.", "Run from updated main or development."],
  ["git switch -c", "Create and switch branch", "git switch -c feature/login", "Modern equivalent of checkout -b.", "Switched to a new branch 'feature/login'", "Using vague names like test2.", "Recommended for new Git users."],
  ["git clone", "Copy remote repository", "git clone https://github.com/user/repo.git", "Downloads a repository and connects origin.", "Cloning into 'repo'...", "Cloning into a nested project accidentally.", "Use SSH URLs in professional setups after configuring keys."],
  ["git remote", "Manage remote names", "git remote -v", "Lists remote aliases and URLs.", "origin https://github.com/user/repo.git (fetch)", "Assuming origin always points to your fork.", "Check before pushing or opening PRs."],
  ["git remote add origin", "Attach remote origin", "git remote add origin https://github.com/user/repo.git", "Adds a remote named origin to a local repo.", "", "Adding the wrong URL then pushing private code.", "Use once after creating a GitHub repo."],
  ["git push", "Upload commits", "git push", "Sends local commits to the configured upstream branch.", "Everything up-to-date", "Pushing to main without review.", "Push feature branches and open PRs."],
  ["git push -u origin main", "Push and set upstream", "git push -u origin main", "Uploads main and remembers origin/main as upstream.", "branch 'main' set up to track 'origin/main'", "Wrong default branch name.", "Use after first push of a new branch."],
  ["git fetch", "Download remote refs", "git fetch origin", "Gets remote updates without merging into your branch.", "", "Expecting files to change immediately.", "Use before comparing or rebasing."],
  ["git pull", "Fetch then integrate", "git pull", "Downloads and merges or rebases remote changes into current branch.", "Already up to date.", "Pulling with dirty work tree.", "Commit or stash first."],
  ["git pull origin main", "Pull specific branch", "git pull origin main", "Fetches origin/main and integrates it into current branch.", "", "Pulling main into the wrong feature branch unintentionally.", "Useful when refreshing a feature branch."],
  ["git push origin feature/login", "Push named branch", "git push origin feature/login", "Uploads a local branch to a matching remote branch.", "", "Pushing temporary branches without cleanup.", "Use to share work and create a PR."]
];

const diagrams = {
  lifecycle: `<svg viewBox="0 0 780 220" aria-label="Git lifecycle"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs><rect class="node" x="25" y="70" width="145" height="70" rx="8"/><text class="svg-text" x="55" y="110">Working Directory</text><line class="arrow" x1="175" y1="105" x2="285" y2="105"/><rect class="node-alt" x="295" y="70" width="130" height="70" rx="8"/><text class="svg-text" x="322" y="110">Staging Area</text><line class="arrow" x1="430" y1="105" x2="535" y2="105"/><rect class="node" x="545" y="70" width="105" height="70" rx="8"/><text class="svg-text" x="572" y="110">Repository</text><line class="arrow" x1="600" y1="68" x2="600" y2="35"/><text class="svg-text" x="575" y="26">HEAD</text><line class="arrow" x1="655" y1="105" x2="735" y2="105"/><text class="svg-text" x="670" y="92">push</text><rect class="node-alt" x="610" y="155" width="140" height="45" rx="8"/><text class="svg-text" x="637" y="183">Remote Repo</text></svg>`,
  branch: `<svg viewBox="0 0 760 260" aria-label="Branch tree"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs><path d="M80 160 C180 160 210 160 310 160 S470 160 590 160" fill="none" stroke="var(--brand)" stroke-width="5"/><path d="M230 158 C300 75 405 75 500 118" fill="none" stroke="var(--brand-2)" stroke-width="5"/><path d="M500 118 C535 138 555 150 590 160" fill="none" stroke="var(--brand-2)" stroke-width="5"/><g class="svg-text"><text x="75" y="190">main</text><text x="330" y="70">feature/login</text><text x="585" y="190">merge</text></g><circle cx="80" cy="160" r="11" fill="var(--brand)"/><circle cx="230" cy="160" r="11" fill="var(--brand)"/><circle cx="390" cy="160" r="11" fill="var(--brand)"/><circle cx="590" cy="160" r="11" fill="var(--brand)"/><circle cx="310" cy="95" r="11" fill="var(--brand-2)"/><circle cx="500" cy="118" r="11" fill="var(--brand-2)"/></svg>`,
  internals: `<svg viewBox="0 0 760 250" aria-label="Git object model"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs><rect class="node" x="60" y="85" width="135" height="70" rx="8"/><text class="svg-text" x="90" y="125">Commit</text><line class="arrow" x1="200" y1="120" x2="300" y2="120"/><rect class="node-alt" x="310" y="85" width="135" height="70" rx="8"/><text class="svg-text" x="360" y="125">Tree</text><line class="arrow" x1="450" y1="120" x2="550" y2="80"/><line class="arrow" x1="450" y1="120" x2="550" y2="165"/><rect class="node" x="560" y="45" width="135" height="60" rx="8"/><text class="svg-text" x="608" y="82">Blob</text><rect class="node" x="560" y="142" width="135" height="60" rx="8"/><text class="svg-text" x="608" y="178">Blob</text></svg>`,
  workflow: `<svg viewBox="0 0 820 210" aria-label="Professional workflow"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs>${["Developer","Branch","Commit","Push","Pull Request","Review","Test","Merge","Deploy"].map((t,i)=>`<rect class="${i%2?"node-alt":"node"}" x="${18+i*88}" y="70" width="78" height="58" rx="8"/><text class="svg-text" x="${30+i*88}" y="104">${t}</text>${i<8?`<line class="arrow" x1="${98+i*88}" y1="99" x2="${104+i*88}" y2="99"/>`:``}`).join("")}</svg>`
};

const baseSections = [
  {
    id: "introduction", icon: "◎", title: "Introduction", diagram: "workflow",
    summary: "Git is the professional memory of a software project. GitHub is the collaboration space where that memory becomes reviewable, shareable, and deployable.",
    cards: [
      ["What is version control?", "A system that records changes over time so teams can compare, restore, and understand a project. Before Git, developers copied folders like project-final-final.zip, which made collaboration fragile."],
      ["Why was Git invented?", "Linus Torvalds created Git in 2005 to support Linux kernel development after the team needed a fast, distributed, trustworthy tool for thousands of contributors."],
      ["Why companies use it", "Microsoft, Google, Meta, startups, universities, and open-source communities use Git-style workflows because code needs history, accountability, review, and rollback."],
      ["Real-life analogy", "Think of Git as a lab notebook plus a time machine. Every commit is a dated experiment with a note explaining what changed and why."]
    ],
    timeline: [["1972", "SCCS popularizes source history ideas."], ["1986", "CVS brings centralized team workflows."], ["2000", "Subversion improves centralized version control."], ["2005", "Git is created for the Linux kernel."], ["2008", "GitHub makes Git collaboration accessible on the web."]],
    callouts: [["tip", "Professional habit", "A developer who uses Git well is easier to trust because their work is reviewable and recoverable."]]
  },
  {
    id: "version-control", icon: "▦", title: "Version Control", diagram: "lifecycle",
    summary: "Version control solves the problem of changing files safely while preserving the ability to compare, collaborate, and return to a known good state.",
    cards: [
      ["Local VCS", "History lives on one machine. It is simple but risky because a laptop failure can destroy the project history."],
      ["Centralized VCS", "A central server stores the main history. Teams get one source of truth, but offline work and server outages are painful."],
      ["Distributed VCS", "Every clone contains the full history. Developers can commit, branch, inspect, and recover locally before syncing."],
      ["Comparison", "Git is distributed: faster local work, stronger recovery, and flexible collaboration. The tradeoff is a steeper learning curve."]
    ],
    table: [["Type", "Example", "Strength", "Weakness"], ["Local", "RCS", "Simple", "Poor collaboration"], ["Centralized", "SVN", "Single authority", "Server dependency"], ["Distributed", "Git", "Offline and resilient", "More concepts"]]
  },
  {
    id: "what-is-git", icon: "◇", title: "What is Git?", diagram: "internals",
    summary: "Git is a distributed version control system that stores snapshots, not just file differences. A commit points to a tree of files and to previous commits.",
    cards: [
      ["Repository", "A project plus its Git database. The database is usually inside the hidden .git folder."],
      ["Snapshot", "A captured version of tracked files at a moment in time."],
      ["Commit", "A saved snapshot with author, date, message, parent commit, and a SHA hash."],
      ["Tracking", "Git only records files you ask it to track. Untracked files are visible but not part of history."]
    ],
    callouts: [["note", "Mental model", "Git does not continuously auto-save your work. You decide what becomes history by staging and committing."]]
  },
  {
    id: "installing-git", icon: "↓", title: "Installing Git", diagram: "lifecycle",
    summary: "Install Git once, then verify the command line can find it.",
    cards: [
      ["Windows", "Install Git for Windows from git-scm.com. Keep the default editor and PATH options if you are new."],
      ["macOS", "Install with Xcode Command Line Tools or Homebrew: brew install git."],
      ["Linux", "Use your package manager: sudo apt install git, sudo dnf install git, or sudo pacman -S git."],
      ["Verification", "Run git --version. Output such as git version 2.45.1 means Git is installed and reachable."]
    ],
    code: [["Verify installation", "git --version\n# output: git version 2.45.1"]]
  },
  {
    id: "git-configuration", icon: "⚙", title: "Git Configuration", diagram: "lifecycle",
    summary: "Git records your name and email in each commit so teams and platforms can identify who made a change.",
    cards: [
      ["user.name", "The human-readable author name attached to commits."],
      ["user.email", "The email attached to commits. On GitHub, use the email connected to your account or a private noreply address."],
      ["--global", "Stores the setting for your user account, so it applies to all repositories unless overridden locally."],
      ["git config --list", "Displays the active settings Git can see."]
    ],
    code: [["Set identity", "git config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"\ngit config --list"]]
  },
  {
    id: "creating-repository", icon: "□", title: "Creating Repository", diagram: "internals",
    summary: "A repository begins when you create a project folder and run git init inside it.",
    cards: [
      ["mkdir", "Creates a folder for the project."],
      ["cd", "Moves your terminal into that folder."],
      ["git init", "Creates .git, the hidden database that stores objects, refs, config, index, and hooks."],
      [".git folder", "Contains the history engine. Deleting it removes Git history from that folder."]
    ],
    code: [["Create a repo", "mkdir student-portal\ncd student-portal\ngit init\n# output: Initialized empty Git repository in student-portal/.git/"]]
  },
  {
    id: "git-lifecycle", icon: "↻", title: "Git Lifecycle", diagram: "lifecycle",
    summary: "Most beginner confusion disappears when you understand the four places work can live: working directory, staging area, repository, and remote.",
    cards: [
      ["Working Directory", "Your real files on disk. Editing a file changes this area first."],
      ["Staging Area", "A preview of the next commit. git add copies chosen changes here."],
      ["Repository", "The committed history stored in .git."],
      ["HEAD", "A pointer to your current commit, usually through the current branch."],
      ["Remote Repository", "A copy of the project hosted elsewhere, commonly GitHub."]
    ],
    callouts: [["warning", "Common mistake", "A file can be modified but not staged. If it is not staged, it will not be included in the next commit."]]
  }
];

const topicalSections = [
  ["git-commands", "⌘", "Git Commands", "Everyday Git commands are professional verbs: inspect, stage, commit, compare, restore, move, stash, tag, and recover.", "commands"],
  ["git-branching", "⑂", "Git Branching", "Branches let teams work on features, fixes, releases, and experiments without disturbing stable code.", "branching"],
  ["merging", "⇄", "Merging", "Merging combines histories. Git can fast-forward, create a merge commit, or ask you to resolve conflicts.", "merging"],
  ["github", "GH", "GitHub", "GitHub adds hosting, code review, issues, projects, releases, Actions, packages, stars, forks, and collaboration around Git repositories.", "github"],
  ["github-commands", "⇅", "GitHub Commands", "Remote commands connect local Git work to GitHub: clone, remote, push, fetch, and pull.", "remote"],
  ["pull-requests", "PR", "Pull Requests", "A pull request is a structured conversation around a proposed change before it enters an important branch.", "pr"],
  ["open-source", "★", "Open Source Contribution", "Open-source contribution usually follows fork, clone, branch, commit, push, pull request, review, and merge.", "open"],
  ["professional-workflow", "▣", "Professional Git Workflow", "Companies protect stable branches with feature branches, reviews, automated tests, and deploy pipelines.", "workflow"],
  ["gitignore", "⊘", "Git Ignore", ".gitignore tells Git which untracked files should stay out of history, such as dependencies, caches, secrets, and build artifacts.", "ignore"],
  ["readme", "MD", "README", "A README is the front door of a repository. It explains what the project is, how to install it, how to use it, and how to contribute.", "readme"],
  ["github-profile", "☻", "GitHub Profile", "A strong GitHub profile works like a developer portfolio: pinned repositories, profile README, contribution graph, and clear project stories.", "profile"],
  ["best-practices", "✓", "Best Practices", "Good Git style means meaningful commits, focused branches, regular pushes, pull requests, and avoiding risky history rewriting on shared branches.", "best"],
  ["common-mistakes", "!", "Common Mistakes", "Most Git mistakes are recoverable if you pause, inspect status/log/reflog, and avoid making the situation worse.", "mistakes"],
  ["advanced-git", "◆", "Advanced Git", "Advanced Git tools help you rewrite local history, locate bugs, manage large files, automate checks, and handle complex repositories.", "advanced"],
  ["git-internals", "∴", "Git Internals", "Git stores content-addressed objects: blobs, trees, commits, tags, refs, and pack files identified by hashes.", "internals"],
  ["interview-questions", "?", "Interview Questions", "Practice concise explanations for beginner, intermediate, and advanced interviews.", "interviews"],
  ["mcqs", "◉", "MCQs", "Test your understanding with a 100-question interactive quiz and score calculator.", "mcq"],
  ["practical-exercises", "✎", "Practical Exercises", "Hands-on practice turns Git from vocabulary into muscle memory.", "exercises"],
  ["cheat-sheet", "▤", "Cheat Sheet", "A printable professional cheat sheet grouped by task.", "cheat"],
  ["git-flow-diagram", "↬", "Git Flow Diagram", "Animated diagrams visualize repository, commit, branch, merge, push, pull, clone, fork, remote, HEAD, and conflict concepts.", "flow"],
  ["live-workshop", "▶", "Live Workshop Section", "A complete instructor-led workshop plan with script, student actions, commands, outputs, and exercises.", "workshop"],
  ["industry-example", "▧", "Real Industry Example", "Build a Student Management System using real branches, commits, merges, pushes, PRs, and one intentional conflict.", "industry"],
  ["final-project", "⚑", "Final Project", "Students build a portfolio website using the full professional Git workflow.", "final"]
].map(([id, icon, title, summary, type]) => ({ id, icon, title, summary, type }));

const sections = [...baseSections, ...topicalSections];

const interviewQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = i < 35 ? "Beginner" : i < 70 ? "Intermediate" : "Advanced";
  const topics = ["repository", "commit", "branch", "merge", "pull request", "rebase", "stash", "reflog", "remote", "conflict"];
  const topic = topics[i % topics.length];
  return {
    level,
    q: `${i + 1}. Explain ${topic} in Git and give one professional use case.`,
    a: `${topic[0].toUpperCase() + topic.slice(1)} is part of Git's workflow for tracking, sharing, or recovering changes. A strong answer defines it, says why it exists, gives a command example, and mentions a risk such as wrong branch, unclear history, or unresolved conflict.`
  };
});

const mcqs = Array.from({ length: 100 }, (_, i) => {
  const bank = [
    ["Which command shows staged and unstaged changes?", ["git status", "git init", "git clone", "git tag"], 0, "git status is the dashboard for the current repository state."],
    ["What does git add do?", ["Stages changes", "Uploads changes", "Deletes history", "Creates GitHub account"], 0, "git add prepares selected changes for the next commit."],
    ["What is a pull request mainly for?", ["Reviewing proposed changes", "Installing Git", "Deleting branches only", "Formatting code locally"], 0, "PRs organize review, discussion, checks, and merge decisions."],
    ["Which command downloads a repository?", ["git clone", "git blame", "git clean", "git show"], 0, "git clone copies a remote repository and configures origin."],
    ["What is HEAD?", ["Pointer to current commit", "GitHub password", "A deleted branch", "The staging folder"], 0, "HEAD points to the commit currently checked out, usually through a branch."]
  ][i % 5];
  return { number: i + 1, question: `${i + 1}. ${bank[0]}`, options: bank[1], answer: bank[2], explanation: bank[3] };
});

const flashcards = [
  ["Repository", "A project folder whose history is tracked by Git."],
  ["Commit", "A saved snapshot with message, author, date, parent, and hash."],
  ["Branch", "A movable pointer that lets work happen independently."],
  ["Staging Area", "The preview of what will go into the next commit."],
  ["Remote", "A named URL for another copy of the repository, often on GitHub."],
  ["Pull Request", "A review conversation around proposed changes."]
];

function slugCommand(command) {
  return command.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function highlight(code) {
  return code
    .replace(/(git|mkdir|cd|sudo|brew)\b/g, '<span class="kw">$1</span>')
    .replace(/(--?[a-z][a-z-]*)/g, '<span class="flag">$1</span>')
    .replace(/("[^"]+")/g, '<span class="str">$1</span>')
    .replace(/(#.*)$/gm, '<span class="comment">$1</span>');
}

function codeBlock(title, code) {
  return `<div class="code-block"><div class="code-title"><span>${title}</span><button class="copy-btn" data-copy="${encodeURIComponent(code)}">Copy</button></div><pre><code>${highlight(code)}</code></pre></div>`;
}

function diagram(name = "lifecycle") {
  return `<div class="diagram">${diagrams[name] || diagrams.lifecycle}</div>`;
}

function cards(items) {
  return `<div class="module-grid">${items.map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>`;
}

function callouts(items = []) {
  return items.map(([type, title, text]) => `<div class="callout ${type}"><strong>${title}:</strong> ${text}</div>`).join("");
}

function commandCards(list) {
  return `<div class="filter-row">${["All", "Local", "Branching", "Remote", "Recovery"].map((x, i) => `<button class="filter-chip ${i === 0 ? "active" : ""}" data-filter="${x.toLowerCase()}">${x}</button>`).join("")}</div><div class="module-grid command-list">${list.map((c, i) => {
    const category = /stash|reflog|restore|reset|clean/.test(c[0]) ? "recovery" : i < 20 ? "local" : i < 25 ? "branching" : "remote";
    return `<div class="card command-card" data-category="${category}" id="${slugCommand(c[0])}"><h3>${c[0]}</h3><p><strong>Purpose:</strong> ${c[1]}</p><p><strong>Syntax:</strong> <code>${c[2]}</code></p><p><strong>Explanation:</strong> ${c[3]}</p>${commandBreakdown(c[2])}${codeBlock("Example and expected output", c[2] + (c[4] ? "\n# output:\n" + c[4] : "\n# output:\nCommand completes silently when there is nothing extra to report."))}<p><strong>Common mistake:</strong> ${c[5]}</p><p><strong>Possible error and solution:</strong> If Git says the path, branch, or remote does not exist, run <code>git status</code>, <code>git branch</code>, and <code>git remote -v</code> to verify your current context before retrying.</p><p><strong>Professional usage:</strong> ${c[6]}</p></div>`;
  }).join("")}</div>`;
}

function commandBreakdown(command) {
  const parts = command.split(/\s+/).map(part => {
    if (part === "git") return ["git", "Runs the Git program."];
    if (part.startsWith("-")) return [part, "A flag that changes how the command behaves."];
    if (/origin|main|HEAD|index\.html|feature|login|old\.js|app\.js|v1\.0\.0|repo\.git/.test(part)) return [part, "An argument: a branch, file, remote, tag, commit, or URL."];
    return [part, "The action Git should perform."];
  });
  return `<p><strong>Word-by-word:</strong></p><ul>${parts.map(([term, text]) => `<li><code>${term}</code> - ${text}</li>`).join("")}</ul>`;
}

function accordion(title, body) {
  return `<div class="accordion"><button class="accordion-trigger">${title}<span>+</span></button><div class="accordion-panel">${body}</div></div>`;
}

function topicalContent(type) {
  const map = {
    commands: commandCards(commandDetails.slice(0, 20)),
    branching: `${diagram("branch")}${cards([["Why branches exist", "Branches isolate work so unstable changes do not interrupt stable code."], ["main vs master", "main is the modern default; master appears in older repositories."], ["Feature branch", "Used for a focused change such as feature/login."], ["Hotfix branch", "Used for urgent production fixes."], ["Release branch", "Used to stabilize a version before deployment."], ["Development branch", "Often used as an integration branch in larger teams."]])}${commandCards(commandDetails.slice(20, 25))}`,
    merging: `${diagram("branch")}${cards([["Fast-forward merge", "If main has not moved, Git simply moves main forward to the feature commit."], ["Three-way merge", "If both branches changed, Git creates a merge commit using the common ancestor."], ["Merge conflict", "A conflict happens when Git cannot decide which line should win."], ["Resolution", "Open the conflicted file, keep the correct content, remove markers, stage, then commit."]])}${codeBlock("Conflict markers", "<<<<<<< HEAD\nCurrent branch version\n=======\nIncoming branch version\n>>>>>>> feature/login")}`,
    github: cards([["Repository", "A hosted project on GitHub."], ["Fork", "Your copy of someone else's repository."], ["Clone", "A local copy downloaded to your computer."], ["Issues", "Tracked tasks, bugs, or discussions."], ["Stars and Watch", "Stars bookmark appreciation; Watch controls notifications."], ["Projects and Wiki", "Projects organize work; Wiki stores documentation."], ["Releases and Packages", "Releases publish versions; Packages host artifacts."], ["Actions", "Automates tests, builds, deployments, and checks."]]),
    remote: commandCards(commandDetails.slice(25)),
    pr: `${diagram("workflow")}${cards([["Why PRs exist", "They protect important branches by making changes visible before merge."], ["Code review", "Reviewers comment on correctness, design, readability, and tests."], ["Approvals", "Teams can require one or more approvals before merge."], ["Comments", "Inline comments attach feedback to exact lines."], ["Merge or close", "Merge accepted work; close work that should not continue."]])}`,
    open: `${cards([["Fork", "Create your GitHub copy."], ["Clone", "Download your fork."], ["Branch", "Create a focused branch."], ["Commit", "Save small changes with clear messages."], ["Push", "Upload your branch."], ["Pull Request", "Ask maintainers to review."], ["Merge", "Maintainer integrates it after review."]])}${codeBlock("Contribution flow", "git clone https://github.com/you/project.git\ncd project\ngit switch -c fix/readme-typo\ngit add README.md\ngit commit -m \"Fix README typo\"\ngit push -u origin fix/readme-typo")}`,
    workflow: `${diagram("workflow")}${cards([["Developer", "Pulls latest code and creates a branch."], ["Feature Branch", "Keeps changes isolated."], ["Commit", "Documents a small unit of work."], ["Push", "Shares work with the team."], ["Pull Request", "Triggers review and checks."], ["Testing", "Automated and manual validation."], ["Merge", "Approved code enters protected branch."], ["Deploy", "Release pipeline ships code."]])}`,
    ignore: `${cards([["Python", "__pycache__/, .venv/, *.pyc, .env."], ["Node", "node_modules/, dist/, .env, npm-debug.log."], ["React", "node_modules/, build/, .env.local."], ["Java", "target/, *.class, .gradle/."], ["Django/Flask/FastAPI", ".env, db.sqlite3 for local-only databases, __pycache__/."], ["Laravel", "vendor/, .env, storage logs when local."]])}${codeBlock(".gitignore example", "node_modules/\n.env\n.env.local\ndist/\nbuild/\n__pycache__/\n*.pyc\n.DS_Store")}`,
    readme: `${cards([["Title and pitch", "Say what the project does in one sentence."], ["Badges", "Show build status, license, version, or coverage."], ["Installation", "List exact commands."], ["Usage", "Show examples and screenshots."], ["Tables", "Use Markdown tables for options or APIs."], ["License", "Tell others how they may use your code."]])}${codeBlock("README skeleton", "# Project Name\n\nShort description.\n\n## Installation\nnpm install\n\n## Usage\nnpm start\n\n## Screenshots\n![App screenshot](screenshots/home.png)\n\n## License\nMIT")}`,
    profile: cards([["Profile README", "Create a repository with the same name as your username and add README.md."], ["Pinned repositories", "Pin projects that prove relevant skills."], ["Contribution graph", "Consistency matters, but quality matters more."], ["Portfolio", "Use descriptions, screenshots, live links, and clean READMEs."], ["Professional tips", "Avoid empty projects, copied code without credit, and unclear commit messages."]]),
    best: cards([["Meaningful commits", "Use messages like Fix login validation, not final update."], ["Branch naming", "Use feature/auth, fix/navbar-overlap, docs/readme."], ["Commit frequency", "Commit when a coherent idea is complete."], ["Avoid force push", "Never rewrite shared history without team agreement."], ["Use PRs", "Review improves correctness and shared knowledge."], ["Never work on main", "Use protected branches for important code."]]),
    mistakes: `${cards([["Forgot git add", "Commit says nothing to commit. Stage files, then commit again."], ["Wrong branch", "Create a new branch from current work or cherry-pick the commit."], ["Detached HEAD", "Create a branch before committing more work."], ["Merge conflict", "Resolve markers carefully and test."], ["Accidental reset", "Use git reflog to find the lost commit."], ["Lost commits", "Search reflog, then branch from the recovered hash."]])}${codeBlock("Recover with reflog", "git reflog\ngit switch -c recovery-branch HEAD@{2}")}`,
    advanced: `${cards([["Cherry-pick", "Apply one commit onto another branch."], ["Rebase", "Replay commits on a new base for linear history."], ["Squash", "Combine several commits into one."], ["Interactive rebase", "Edit, reorder, squash, or reword local commits."], ["Bisect", "Binary search history to find the commit that introduced a bug."], ["Submodules", "Reference another repository inside a repository."], ["Hooks", "Run scripts at Git events."], ["Git LFS", "Store large binary files outside normal Git objects."], ["Worktree", "Check out multiple branches in separate folders."]])}${codeBlock("Advanced examples", "git cherry-pick a1b2c3d\ngit rebase main\ngit rebase -i HEAD~3\ngit bisect start\ngit worktree add ../hotfix hotfix/login")}`,
    internals: `${diagram("internals")}${cards([["Blob", "File content object."], ["Tree", "Directory listing that points to blobs and trees."], ["Commit object", "Points to a tree, parent commit, author, and message."], ["SHA and hashing", "A content-based identifier. Change content and the hash changes."], ["HEAD and refs", "HEAD points to a branch ref; branch refs point to commits."], ["Objects and pack files", "Loose objects are later compressed into pack files for efficiency."]])}`,
    interviews: interviewHTML(),
    mcq: quizHTML(),
    exercises: exercisesHTML(),
    cheat: cheatHTML(),
    flow: `${diagram("workflow")}${diagram("lifecycle")}${diagram("branch")}${diagram("internals")}${cards([["Repository", "Container for history."], ["Commit", "Saved snapshot."], ["Branch", "Movable line of work."], ["Merge", "Combines work."], ["Push/Pull", "Syncs with remote."], ["Clone/Fork", "Copies repositories."], ["Remote/HEAD", "Remote is another repo; HEAD is current position."], ["Conflict", "Manual decision required."]])}`,
    workshop: workshopHTML(),
    industry: industryHTML(),
    final: finalHTML()
  };
  return map[type] || "";
}

function interviewHTML() {
  const groups = ["Beginner", "Intermediate", "Advanced"].map(level => {
    const rows = interviewQuestions.filter(q => q.level === level).map(q => accordion(q.q, `<p>${q.a}</p>`)).join("");
    return `<h3>${level}</h3>${rows}`;
  }).join("");
  return `<p>Use these as speaking practice. Strong answers are short, command-aware, and honest about risks.</p>${groups}`;
}

function quizHTML() {
  return `<div class="quiz-zone"><p class="eyebrow">Interactive Quiz</p><div id="quizCount"></div><p class="quiz-question" id="quizQuestion"></p><div class="quiz-options" id="quizOptions"></div><p id="quizExplanation"></p><div class="quiz-actions"><button id="nextQuestion">Next Question</button><button id="resetQuiz">Reset Score</button><strong id="quizScore">Score: 0 / 0</strong></div></div>`;
}

function exercisesHTML() {
  return `${cards([["Beginner", "Create a repository, add three files, make three commits, inspect log, and restore one file."], ["Intermediate", "Create feature and hotfix branches, merge them, resolve a planned conflict, and push to GitHub."], ["Advanced", "Use rebase, cherry-pick, stash, bisect, tags, and reflog recovery in a sample project."], ["Mini projects", "Todo CLI, portfolio website, README improvement, issue tracker board."], ["Assignments", "Submit a GitHub repository URL and a screenshot of the commit graph."], ["Solutions", "Compare your commands with the provided reference flow after attempting the task."]])}${codeBlock("Beginner exercise solution", "mkdir git-practice\ncd git-practice\ngit init\necho \"Hello\" > README.md\ngit add README.md\ngit commit -m \"Add README\"\ngit log --oneline")}`;
}

function cheatHTML() {
  return `<section class="cheat-print printable">${cards([["Setup", "git config --global user.name, git config --global user.email"], ["Start", "git init, git clone"], ["Inspect", "git status, git log, git diff, git show"], ["Stage/commit", "git add, git commit -m"], ["Branch", "git branch, git switch, git switch -c"], ["Merge", "git merge, resolve conflicts, git commit"], ["Remote", "git remote -v, git push, git fetch, git pull"], ["Undo", "git restore, git reset, git revert, git reflog"], ["Temporary", "git stash, git stash pop"], ["Cleanup/release", "git clean -fdn, git tag"]])}<button onclick="window.print()" class="filter-chip">Print Cheat Sheet</button></section>`;
}

function workshopHTML() {
  return `${cards([["Instructor says", "Today we will treat Git as a professional safety system, not a memorization topic."], ["Students do", "Open terminal, configure identity, create a repository, and practice status/add/commit."], ["Expected output", "Students should see clean status after committing and a compact log with meaningful messages."], ["Exercise loop", "Explain, demonstrate, students repeat, students break something safely, recover together."], ["Assessment", "Each student opens a PR and explains their branch, commit, and change."]])}${codeBlock("Live workshop command script", "git config --global user.name \"Student Name\"\ngit config --global user.email \"student@example.com\"\nmkdir workshop-portfolio\ncd workshop-portfolio\ngit init\necho \"# Portfolio\" > README.md\ngit status\ngit add README.md\ngit commit -m \"Add portfolio README\"\ngit log --oneline")}`;
}

function industryHTML() {
  return `${diagram("workflow")}${cards([["Project", "Student Management System with attendance, grades, and profile modules."], ["Branches", "feature/student-profile, feature/attendance, hotfix/login-validation."], ["Commits", "Add student model, Add attendance form, Fix login validation."], ["Merge", "Feature branches merge through PRs after tests pass."], ["Conflict", "Two branches edit README setup steps; students resolve by keeping both correct instructions."], ["Release", "Tag v1.0.0 after main is stable."]])}${codeBlock("Industry flow", "git switch -c feature/student-profile\ngit add students.html style.css\ngit commit -m \"Add student profile page\"\ngit push -u origin feature/student-profile\n# Open pull request on GitHub\n\ngit switch main\ngit pull origin main\ngit switch -c hotfix/login-validation\ngit commit -am \"Fix login validation\"\ngit push -u origin hotfix/login-validation")}`;
}

function finalHTML() {
  return `${cards([["Goal", "Build a personal portfolio website and manage it with professional Git workflow."], ["Requirements", "README, .gitignore, feature branches, at least eight meaningful commits, one PR, one tag."], ["Workflow", "Plan issues, create branches, commit small, push, open PR, review, merge, deploy."], ["Submission", "GitHub repository link, live site link, screenshot, and a short reflection on one Git mistake recovered."]])}${codeBlock("Final project commands", "git clone https://github.com/you/portfolio.git\ncd portfolio\ngit switch -c feature/homepage\ngit add index.html style.css\ngit commit -m \"Add homepage layout\"\ngit push -u origin feature/homepage\n# Open PR, review, merge, tag release\ngit tag -a v1.0.0 -m \"Portfolio v1\"\ngit push origin v1.0.0")}`;
}

function renderSection(section) {
  const body = section.type ? topicalContent(section.type) : [
    diagram(section.diagram),
    section.cards ? cards(section.cards) : "",
    section.table ? tableHTML(section.table) : "",
    section.timeline ? timelineHTML(section.timeline) : "",
    section.code ? section.code.map(([t, c]) => codeBlock(t, c)).join("") : "",
    callouts(section.callouts)
  ].join("");
  return `<section class="lesson ${section.id === "cheat-sheet" ? "printable" : ""}" id="${section.id}" data-title="${section.title.toLowerCase()}">
    <div class="lesson-header"><p class="eyebrow">${section.icon} Module ${sections.indexOf(section) + 1}</p><h2>${section.title}</h2><p class="summary">${section.summary}</p></div>
    <div class="lesson-body">${body}<div class="callout tip"><strong>Summary:</strong> If you can define the concept, explain why it exists, run the command, read the output, and recover from a common mistake, you are using this topic professionally.</div></div>
  </section>`;
}

function tableHTML(rows) {
  return `<table>${rows.map((row, i) => `<tr>${row.map(cell => `<${i ? "td" : "th"}>${cell}</${i ? "td" : "th"}>`).join("")}</tr>`).join("")}</table>`;
}

function timelineHTML(items) {
  return `<div class="timeline">${items.map(([year, text]) => `<div class="timeline-item"><strong>${year}</strong><br>${text}</div>`).join("")}</div>`;
}

function render() {
  $("#sections").innerHTML = sections.map(renderSection).join("");
  $("#sideNav").innerHTML = sections.map((s, i) => `<a href="#${s.id}"><span>${String(i + 1).padStart(2, "0")}</span>${s.title}</a>`).join("");
  $("#tocList").innerHTML = sections.slice(0, 12).map(s => `<a href="#${s.id}">${s.title}</a>`).join("");
  bindInteractions();
  startQuiz();
  updateProgress();
}

function bindInteractions() {
  $$(".copy-btn").forEach(btn => btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copy));
    btn.textContent = "Copied";
    setTimeout(() => btn.textContent = "Copy", 900);
  }));
  $$(".accordion-trigger").forEach(btn => btn.addEventListener("click", () => {
    const parent = btn.closest(".accordion");
    parent.classList.toggle("open");
    $("span", btn).textContent = parent.classList.contains("open") ? "−" : "+";
  }));
  $$(".filter-chip").forEach(btn => btn.addEventListener("click", () => {
    const wrap = btn.closest(".lesson-body");
    if (!wrap) return;
    $$(".filter-chip", wrap).forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    $$(".command-card", wrap).forEach(card => card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none");
  }));
}

function updateProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = height > 0 ? Math.round((scrollTop / height) * 100) : 0;
  $("#scrollMeter").style.width = `${percent}%`;
  $("#progressBar").style.width = `${percent}%`;
  $("#progressText").textContent = `${percent}%`;
  $("#toTop").classList.toggle("show", scrollTop > 700);
  const current = sections.findLast(s => document.getElementById(s.id).getBoundingClientRect().top < 150) || sections[0];
  $$("#sideNav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`));
}

function startQuiz() {
  let index = 0, score = 0, answered = 0;
  const renderQuestion = () => {
    const q = mcqs[index % mcqs.length];
    $("#quizCount").textContent = `Question ${q.number} of ${mcqs.length}`;
    $("#quizQuestion").textContent = q.question;
    $("#quizExplanation").textContent = "";
    $("#quizOptions").innerHTML = q.options.map((opt, i) => `<button data-answer="${i}">${opt}</button>`).join("");
    $$("#quizOptions button").forEach(btn => btn.addEventListener("click", () => {
      if ($(".correct, .wrong", $("#quizOptions"))) return;
      const selected = Number(btn.dataset.answer);
      answered++;
      if (selected === q.answer) score++;
      btn.classList.add(selected === q.answer ? "correct" : "wrong");
      $(`#quizOptions button[data-answer="${q.answer}"]`).classList.add("correct");
      $("#quizExplanation").textContent = q.explanation;
      $("#quizScore").textContent = `Score: ${score} / ${answered}`;
    }));
  };
  $("#nextQuestion")?.addEventListener("click", () => { index = (index + 1) % mcqs.length; renderQuestion(); });
  $("#resetQuiz")?.addEventListener("click", () => { score = 0; answered = 0; index = 0; $("#quizScore").textContent = "Score: 0 / 0"; renderQuestion(); });
  renderQuestion();
}

function searchCourse(query) {
  const q = query.trim().toLowerCase();
  const box = $("#searchResults");
  if (!q) { box.hidden = true; return; }
  const matches = sections.filter(s => `${s.title} ${s.summary}`.toLowerCase().includes(q))
    .concat(commandDetails.filter(c => c.join(" ").toLowerCase().includes(q)).slice(0, 8).map(c => ({ id: slugCommand(c[0]), title: c[0], summary: c[1] })))
    .slice(0, 12);
  box.hidden = false;
  box.innerHTML = `<strong>${matches.length} result(s)</strong>${matches.map(m => `<a class="result-link" href="#${m.id}">${m.title}<br><small>${m.summary || ""}</small></a>`).join("")}`;
}

const playgroundResponses = {
  "git status": "On branch main\nnothing to commit, working tree clean",
  "git add .": "Changes staged for next commit.\nTip: run git status to confirm what was staged.",
  "git commit -m": "[main a1b2c3d] Your commit message\n 2 files changed, 14 insertions(+)",
  "git log --oneline": "a1b2c3d Add homepage\n9d8e7f6 Configure project\n4c3b2a1 Initial commit",
  "git branch": "* main\n  feature/login\n  hotfix/navbar",
  "git switch -c": "Switched to a new branch.\nNow commit related work on this branch.",
  "git push": "Enumerating objects: 5, done.\nBranch is now available on the remote repository.",
  "git pull": "Already up to date.\nIf remote has changes, Git would fetch and integrate them."
};

function runPlayground() {
  const value = $("#playgroundInput").value.trim();
  const key = Object.keys(playgroundResponses).find(k => value.startsWith(k));
  $("#playgroundOutput").textContent = key ? playgroundResponses[key] : `Simulated explanation:\n"${value}" is a Git-style command. Check syntax, run git status before risky actions, and read Git's output carefully.`;
}

let flashIndex = 0;
function nextFlashcard() {
  flashIndex = (flashIndex + 1) % flashcards.length;
  $("#flashTerm").textContent = flashcards[flashIndex][0];
  $("#flashDefinition").textContent = flashcards[flashIndex][1];
}

function navigateLesson(direction) {
  const positions = sections.map(s => [s.id, document.getElementById(s.id).getBoundingClientRect().top]);
  let current = positions.findLast(([, top]) => top < 180)?.[0] || sections[0].id;
  let idx = sections.findIndex(s => s.id === current);
  idx = Math.max(0, Math.min(sections.length - 1, idx + direction));
  document.getElementById(sections[idx].id).scrollIntoView({ behavior: "smooth" });
}

render();

window.addEventListener("scroll", updateProgress, { passive: true });
$("#themeToggle").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "";
  localStorage.setItem("gitCourseTheme", dark ? "dark" : "light");
});
if (localStorage.getItem("gitCourseTheme") === "dark") document.documentElement.dataset.theme = "dark";
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$("#searchInput").addEventListener("input", e => searchCourse(e.target.value));
$("#runCommand").addEventListener("click", runPlayground);
$("#playgroundInput").addEventListener("keydown", e => { if (e.key === "Enter") runPlayground(); });
$("#flashcard").addEventListener("click", nextFlashcard);
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#prevLesson").addEventListener("click", () => navigateLesson(-1));
$("#nextLesson").addEventListener("click", () => navigateLesson(1));
document.addEventListener("keydown", e => {
  if (e.key === "/") { e.preventDefault(); $("#searchInput").focus(); }
  if (e.altKey && e.key === "ArrowRight") navigateLesson(1);
  if (e.altKey && e.key === "ArrowLeft") navigateLesson(-1);
});
