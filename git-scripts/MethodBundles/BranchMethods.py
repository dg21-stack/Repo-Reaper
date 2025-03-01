import time

class BranchMethods:
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
    
    def create_git_branch(self, branch_name):
        result = self._run_git_command(["git", "branch", branch_name])
        if not result:
            result = {"status": "success", "branch": branch_name, "output": result}
        else:
            raise Exception(f"Failed to create branch: {result}")
        
        # Switch to the new branch
        switch_result = self.switch_branch(branch_name)
        
        # Set upstream and push the new branch
        try:
            push_result = self._run_git_command(["git", "push", "--set-upstream", "origin", branch_name])
            result["push"] = push_result
        except Exception as e:
            result["push_error"] = str(e)
        print(self.current_branch)
        return result
        
    
    def delete_git_branch(self, branch_name):
        if self.current_branch == branch_name: # Delete will fail if not checked out of branch to be deleted
            self.switch_branch("main") #TODO: Either keep track of main branch name in case its not main, or keep cache of previously visited branches
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
    
    def branch_exists(self, branch_name) -> bool:
        branches = self.get_branches()
        return branch_name in branches
