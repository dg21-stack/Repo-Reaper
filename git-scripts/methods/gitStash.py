import subprocess

def git_stash(repo_path, branch):
    result = subprocess.run(["git", "stash", branch], capture_output=True, text=True, cwd=repo_path)
    return result.stdout

def git_stash_pop(repo_path, branch):
    result = subprocess.run(["git", "stash", "pop", branch], capture_output=True, text=True, cwd=repo_path)
    return result.stdout

def git_stash_list(repo_path, branch):
    result = subprocess.run(["git", "stash", "list", branch], capture_output=True, text=True, cwd=repo_path)
    return result.stdout