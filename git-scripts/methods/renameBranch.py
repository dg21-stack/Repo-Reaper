import subprocess
from getBranches import get_repo_branches

def rename_git_branch(repo_path, old_branch, new_branch):
    try:
        # Rename the branch locally
        subprocess.run(["git", "-C", repo_path, "branch", "-m", old_branch, new_branch], check=True)

        # Delete the old branch from the remote
        subprocess.run(["git", "-C", repo_path, "push", "origin", "--delete", old_branch], check=False)

        # Push the new branch to the remote
        subprocess.run(["git", "-C", repo_path, "push", "origin", new_branch], check=True)

        # Unset upstream tracking for the old branch
        subprocess.run(["git", "-C", repo_path, "branch", "--unset-upstream"], check=False)

        # Set upstream tracking for the new branch
        subprocess.run(["git", "-C", repo_path, "push", "--set-upstream", "origin", new_branch], check=True)

    except subprocess.CalledProcessError as e:
        raise "naming process failed"

    return "renamed branch {old_branch} to {new_branch}"

print(rename_git_branch("C:/Users/Daniel/Repo-Reaper", "repo-reaper-fe-01", "repo-reaper-fe"))
print(get_repo_branches("C:/Users/Daniel/Repo-Reaper"))