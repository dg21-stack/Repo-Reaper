import subprocess

def add_commit_push(repo_path, message):
    # switch_result = subprocess.run(["git", "switch", branch], capture_output=True, text=True, cwd=repo_path)
    # if switch_result.returncode != 0:
    #     return f"Error switching to branch {branch}: {switch_result.stderr}"
    
    add_result = subprocess.run(["git", "add", "."], cwd=repo_path, capture_output=True, text=True)
    commit_result = subprocess.run(["git", "commit", "-m", message], cwd=repo_path, capture_output=True, text=True)
    push_result = subprocess.run(["git", "push"], cwd=repo_path, capture_output=True, text=True)
    
    return {
        "add": add_result.stdout,
        "commit": commit_result.stdout, 
        "push": push_result.stdout
    }
