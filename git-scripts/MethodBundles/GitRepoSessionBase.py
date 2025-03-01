import time
import subprocess

class GitRepoSessionBase:
    def __init__(self, repo_path):
        self.repo_path = repo_path
        self.current_branch = None
        self.last_accessed = time.time()
        # Initial setup - detect current branch
        self.current_branch = self._get_current_branch()

    def _run_git_command(self, command):
        # Handle both string and list commands
        process = subprocess.Popen(
            command if isinstance(command, str) else " ".join(command),
            shell=True, 
            cwd=self.repo_path, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            raise Exception(f"Git command failed: {stderr.decode()}")
        return stdout.decode()
    
    def _get_current_branch(self):
        result =  self._run_git_command(["git", "branch", "--show-current"])
        if not result:
            raise Exception("Failed to get current branch")
        return result.strip()