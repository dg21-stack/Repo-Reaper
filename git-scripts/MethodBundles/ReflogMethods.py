class ReflogMethods:
    def get_reflog(self):
        result = self._run_git_command(["git", "reflog", self.current_branch])
        if not result:
            raise Exception("Failed to get reflog")
        reflog_entries = [entry for entry in result.split('\n') if entry]
        return reflog_entries