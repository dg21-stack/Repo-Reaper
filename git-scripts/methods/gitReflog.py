import subprocess

def get_reflog(repo_path, branch):
    query = ["git", "reflog"]
    if branch != "main":
        query.append(branch)
    
    result = subprocess.run(query, capture_output=True, text=True, cwd=repo_path)
    
    reflog_dict = {}
    for entry in result.stdout.split('\n'):
        if entry:
            parts = entry.split(" ", 2) 
            if len(parts) >= 3:
                commit_hash = parts[0]  
                reflog_message = parts[2]
                if commit_hash in reflog_dict: 
                    reflog_dict[commit_hash].append(reflog_message)
                else:
                    reflog_dict[commit_hash] = [reflog_message]
    
    return reflog_dict