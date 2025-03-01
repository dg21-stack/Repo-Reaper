class ReflogMethods:
    def get_reflog_all(self):
        result = self._run_git_command(["git", "reflog", self.current_branch])
        if not result:
            raise Exception("Failed to get reflog")
        reflog_entries = [entry for entry in result.split('\n') if entry]
        return reflog_entries
    
    def get_reflog_specific_branch(self, branch):
        result = self._run_git_command(["git", "reflog", branch])
        if not result:
            raise Exception("Failed to get reflog")
        reflog_entries = [entry for entry in result.split('\n') if entry]
        return reflog_entries