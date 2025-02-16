import subprocess
def get_repo_branches(repo_path):
    result = subprocess.run(["git", "branch", "-a"], capture_output=True, text=True, cwd=repo_path)
    branches = [branch.strip() for branch in result.stdout.split("\n")]

    results = []
    for branch in branches:
        if branch.startswith("*"):
            results.append(branch[2:])
        elif not branch.startswith("remotes/"):
            results.append(branch)
    return results[:-1]
