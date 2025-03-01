class DiffMethods:
    def git_diff(self, branch = None):
        if not branch:
            branch = self.current_branch
        result = self._run_git_command(["git", "diff", branch])
        return result