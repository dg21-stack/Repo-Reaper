class StashMethods:
    def git_stash(self, branch = None):
        if branch is None:
            branch = self.current_branch
        try:
            result = self._run_git_command(["git", "stash"])
        except Exception as e:
            print(e)
            return e
        return result
    
    def git_stash_pop(self, branch = None):
        if branch is None:
            branch = self.current_branch
        try:
            result = self._run_git_command(["git", "stash", "pop"])
        except Exception as e:
            print(e)
            return e
        return result

    def git_stash_list(self, branch = None):
        if branch is None:
            branch = self.current_branch
        try:
            result = self._run_git_command(["git", "stash", "list"])
        except Exception as e:
            print(e)
            return e
        result = [line for line in result.split("\n") if line.strip()]
        return result
        