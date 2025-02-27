import subprocess
def delete_git_branch(repo_path, branch_name):
    try:
        # Delete the branch locally
        subprocess.run(["git", "-C", repo_path, "branch", "-d", branch_name], check=True)

        # Delete the branch from remote
        subprocess.run(["git", "-C", repo_path, "push", "origin", "--delete", branch_name], check=False)

        print(f"Branch '{branch_name}' deleted locally and from remote.")
    except subprocess.CalledProcessError as e:
        print(f"Error deleting branch: {e}")
        raise