class ReflogMethods:
    def get_reflog_all(self):
        result = self._run_git_command(["git", "reflog", self.current_branch])
        
        return self._reflog_iter(result)
        
        
    
    def get_reflog_specific_branch(self, branch):
        query = ["git", "reflog"]
        if branch != "main":
            query.append(branch)

        result = self._run_git_command(query)
        
        return self._reflog_iter(result)
    
    def _reflog_iter(self, result):
        if not result:
                raise Exception("Failed to get reflog")
        
        reflog_dict = {}
        for entry in result.split('\n'):
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