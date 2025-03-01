class LogMethods:

    def git_log_specific_branch(self, branch = None):
        if branch is None:
            branch = self.get_current_branch()
        if not self.branch_exists(branch):
            raise Exception(f"Branch '{branch}' does not exist in {self.repo_path}. Skipping...")
        result = self._run_git_command(["git", "log", branch])
        if not result:
            raise Exception("Failed to get log")
    
        commit_entries = []
        last_updated_time = 0
        
        # Parse git log output
        commit_info = {}
        current_commit = None
        timestamp = 0
        
        for line in result.strip().split("\n"):
            if line.startswith("commit "):
                # Save previous commit if exists
                if current_commit:
                    commit_entries.append(commit_info)
                    
                # Start new commit
                current_commit = line.split(" ")[1]
                commit_info = {
                    "id": current_commit,
                    "message": "",
                    "time": 0
                }
            elif line.startswith("Date:"):
                # Extract timestamp from date line
                date_str = line[5:].strip()
                # Convert to timestamp (simplified - would need proper date parsing)
                import time
                from datetime import datetime
                try:
                    # Parse date format like: Thu Feb 27 11:49:30 2025 -0500
                    dt = datetime.strptime(date_str, "%a %b %d %H:%M:%S %Y %z")
                    timestamp = int(dt.timestamp())
                    commit_info["time"] = timestamp
                    last_updated_time = max(timestamp, last_updated_time)
                except Exception as e:
                    print(f"Error parsing date: {date_str} - {str(e)}")
            elif line and not line.startswith("Author:") and not current_commit is None:
                # This is likely the commit message
                line = line.strip()
                if line:
                    commit_info["message"] = line
        
        # Add the last commit
        if current_commit:
            commit_entries.append(commit_info)

        return {"branchHistory":commit_entries, "lastUpdatedTime": last_updated_time}
                                
    def git_log_all(self):
        branches = self.get_branches()
        branch_entries = []
        for branch in branches:
            try: 
                results = self.git_log_specific_branch(branch)
                branch_entries.append({
                    "branch": branch,
                    "lastUpdatedTime": results["lastUpdatedTime"],
                    "commitHistory": results["branchHistory"]
                })
            except Exception as e:
                print(f"Warning: Failed to get log for branch '{branch}': {str(e)}")
                # Continue with other branches instead of raising exception
                continue
        return {
            "repo_name": self.repo_path,
            "branchHistory": branch_entries
        }