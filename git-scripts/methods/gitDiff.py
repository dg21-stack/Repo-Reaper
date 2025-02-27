import subprocess

def git_diff(repo_path, branch):
    result = subprocess.run(["git", "diff", branch], capture_output=True, text=True, cwd=repo_path)
    return result.stdout

