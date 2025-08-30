# Push Changes for GitHub Issue

Please push the current changes to GitHub for issue: $ARGUMENTS

Follow these steps in order:

1. **Stage all changes**:
   - Run `git add .` to stage all modified files
   - Verify what's being staged with `git status`

2. **Generate and create commit**:
   - Analyze the staged changes using `git diff --cached`
   - Look up the GitHub issue details using `gh issue view $ARGUMENTS` to understand the context
   - Create a concise, descriptive commit message that:
     - Starts with a clear action verb (fix, add, update, remove, etc.)
     - Briefly describes what was changed
     - References the issue number (e.g., "fixes #123" or "addresses #123")
     - Keeps the subject line under 50 characters when possible
   - Commit the changes with this message

3. **Determine and push to correct branch**:
   - Check the current branch with `git branch --show-current`
   - If on main/master, create and switch to a new feature branch named `issue-$ARGUMENTS` or similar
   - Push the changes to the appropriate remote branch
   - If this is a new branch, set up upstream tracking

4. **Verify the push**:
   - Confirm the push was successful
   - Show the current git status
   - Display the commit hash and message for confirmation

**Important guidelines**:
- Keep commit messages clear and concise
- Always reference the issue number in the commit message
- Use conventional commit format when possible (feat:, fix:, docs:, etc.)
- Ensure you're pushing to the right branch (not directly to main unless specified)
- If there are any conflicts or issues, stop and ask for guidance

**Example commit messages**:
- `fix: resolve authentication bug (fixes #42)`
- `feat: add user dashboard component (addresses #15)`
- `docs: update API documentation (closes #88)`
