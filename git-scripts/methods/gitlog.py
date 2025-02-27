import subprocess
from getBranches import get_repo_branches

def branch_exists(repo_path, branch):
    """Check if a branch exists in the repository."""
    result = subprocess.run(
        ["git", "-C", repo_path, "branch", "--list", branch],
        capture_output=True,
        text=True
    )
    return branch in result.stdout.strip()

def run_git_log_specific_branch(repo_path, branch):
    """Retrieve commit history for a specific branch."""
    if not branch_exists(repo_path, branch):
        print(f"Branch '{branch}' does not exist in {repo_path}. Skipping...")
        return {}, 0

    result = subprocess.run(
        ["git", "-C", repo_path, "log", branch, "--pretty=format:%H|%ct|%s"],
        capture_output=True,
        text=True
    )

    commit_entries = {}
    last_updated_time = 0

    for line in result.stdout.strip().split("\n"):
        if line:
            commit_id, timestamp, message = line.split("|", 2)
            last_updated_time = max(int(timestamp), last_updated_time)
            commit_entries[commit_id] = {
                "time": int(timestamp),
                "message": message
            }

    return commit_entries, last_updated_time


def run_git_log_all_branch(repo_path):
    """Retrieve commit history for all branches in the repository."""
    branches = get_repo_branches(repo_path)
    branch_entries = []

    for branch in branches:
        commit_history, last_updated_time = run_git_log_specific_branch(repo_path, branch)
        branch_entries.append({
            "branch": branch,
            "lastUpdatedTime": last_updated_time,
            "commitHistory": commit_history
        })

    return {
        "repo_name": repo_path,
        "branchHistory": branch_entries
    }


print(run_git_log_all_branch("C:/Users/Daniel/Repo-Reaper"))
