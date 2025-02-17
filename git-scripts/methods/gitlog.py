import subprocess
def run_git_log(repo_path, branch):
    switch_result = subprocess.run(["git", "checkout", branch], capture_output=True, text=True, cwd=repo_path)
    if switch_result.returncode != 0:
        return f"Error switching to branch {branch}: {switch_result.stderr}"
        
    result1 = subprocess.run(["git", "log"], capture_output=True, text=True, cwd=repo_path)
    return str(result1.stdout)
