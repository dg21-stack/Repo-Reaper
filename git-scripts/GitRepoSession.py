import time
import subprocess

class GitRepoSession:
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
    
    def get_branches(self):
        result = self._run_git_command(["git", "branch"])
        if not result:
            raise Exception("Failed to get branches")
        return [branch.strip().replace('* ', '') for branch in result.split('\n') if branch.strip()]

    def get_branches_all(self):
        result = self._run_git_command(["git", "branch", "-a"])
        if not result:
            raise Exception("Failed to get all branches")
        return [branch.strip().replace('* ', '') for branch in result.split('\n') if branch.strip()]

    def switch_branch(self, branch_name):
        """Switch to specified branch"""
        # Validate the branch exists
        branches = self.get_branches()
        branch_names = [b.replace('* ', '') for b in branches]  # Remove asterisk from current branch
        
        if branch_name not in branch_names:
            raise Exception(f"Branch '{branch_name}' does not exist")
        
        result = self._run_git_command(f"git checkout {branch_name}")
        self.current_branch = branch_name
        self.last_accessed = time.time()
        return {"status": "success", "branch": branch_name, "output": result}
    
    def get_reflog(self):
        result = self._run_git_command(["git", "reflog", self.current_branch])
        if not result:
            raise Exception("Failed to get reflog")
        reflog_entries = [entry for entry in result.split('\n') if entry]
        return reflog_entries
    
    def create_git_branch(self, branch_name):
        result = self._run_git_command(["git", "branch", branch_name])
        if not result:
            return {"status": "success", "branch": branch_name, "output": result}
        else:
            raise Exception(f"Failed to create branch: {result}")
    
    def delete_git_branch(self, branch_name):
        try:
            result = [self._run_git_command(["git", "branch", "-d", branch_name])]
            if f"remotes/origin/{branch_name}" in self.get_branches_all():
                try:
                    self._run_git_command(["git", "push", "origin", "--delete", branch_name])
                    result.append(f"Deleted remote branch: {branch_name}")
                except Exception as e:
                    raise Exception(f"Failed to delete remote branch: {str(e)}")
            # If we get here, the command was successful
            return {"status": "success", "branch": branch_name, "output": result}
        except Exception as e:
            raise Exception(f"Failed to delete branch: {str(e)}")
