from GitRepoSession import GitRepoSession

class GitRepositoryManager:
    def __init__(self):
        # Dictionary to track active repository sessions
        # Key: repo_path, Value: GitRepoSession instance
        self.active_repos = {}
        # Currently active repository path
        self.current_repo_path = None
        # Currently active branch for the active repository
        self.current_branch = None
    
    def get_repo_session(self, repo_path=None):
        """Get or create a session for the specified repository path"""
        # If no repo_path specified, use current active repo
        if repo_path is None:
            if self.current_repo_path is None:
                raise Exception("No active repository selected")
            repo_path = self.current_repo_path
        
        # Create session if it doesn't exist
        if repo_path not in self.active_repos:
            self.active_repos[repo_path] = GitRepoSession(repo_path)
        
        return self.active_repos[repo_path]
    
    def set_active_repo(self, repo_path):
        """Set the currently active repository"""
        # Create session if it doesn't exist
        if repo_path not in self.active_repos:
            self.active_repos[repo_path] = GitRepoSession(repo_path)
        
        self.current_repo_path = repo_path
        # Set current branch to the repo's current branch
        self.current_branch = self.active_repos[repo_path].current_branch
        return self.active_repos[repo_path]
    
    def set_active_branch(self, branch_name):
        """Set the currently active branch for the active repository"""
        if self.current_repo_path is None:
            raise Exception("No active repository selected")
        
        # Update the current branch
        self.current_branch = branch_name
        return self.current_branch
    
    def get_active_branch(self):
        """Get the currently active branch"""
        return self.current_branch
    
    def get_active_repo_path(self):
        """Get the path of the currently active repository"""
        return self.current_repo_path
    
    def cleanup_inactive_sessions(self, max_idle_time=3600):
        """Clean up sessions that haven't been used for a while"""
        # Implementation to remove stale sessions
        pass