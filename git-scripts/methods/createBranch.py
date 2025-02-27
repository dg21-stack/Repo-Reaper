import subprocess

def create_git_branch(repo_path, branch_name):
    try:
        # Create a new branch locally
        subprocess.run(["git", "branch", branch_name], check=True, cwd=repo_path)
        
        # # Push the new branch to remote
        # subprocess.run(["git", "-C", repo_path, "push", "-u", "origin", branch_name], check=True)

        print(f"Branch '{branch_name}' created and pushed to remote.")
    except subprocess.CalledProcessError as e:
        print(f"Error creating branch: {e}")
        raise

    return f'branch {branch_name} created'