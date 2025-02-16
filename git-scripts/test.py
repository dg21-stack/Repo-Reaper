import subprocess
def run_git_command(repo_path, command):
    result1 = subprocess.run(command.split(), capture_output=True, text=True, cwd=repo_path)
    result2 = subprocess.run(command.split(), capture_output=True, text=True, cwd=repo_path)
    return result1.stdout + result2.stdout

print(run_git_command("/Users/maxpintchouk/Code/Narrative/narrative-mobile", "git log"))