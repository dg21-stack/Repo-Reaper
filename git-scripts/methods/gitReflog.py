import subprocess

def get_reflog(repo_path, branch):
    result = subprocess.run(["git", "reflog", branch], capture_output=True, text=True, cwd=repo_path)
    
    reflog_entries = [entry for entry in result.stdout.split('\n') if entry]
    return reflog_entries

