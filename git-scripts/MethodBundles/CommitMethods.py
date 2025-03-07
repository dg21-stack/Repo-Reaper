class CommitMethods:
    def git_add(self):
        try:
            result = self._run_git_command(["git", "add", "."])
            return result
        except Exception as e:
            print(e)
            return e
    
    def git_commit(self, message):
        try:
            # Use a string command instead of a list to preserve the message
            result = self._run_git_command(f'git commit -m "{message}"')
            return result
        except Exception as e:
            print(f"Git commit error: {e}")
            return e

    def git_push(self):
        try:
            # First try a regular push
            result = self._run_git_command(["git", "push"])
            return result
        except Exception as e:
            # Check if the error is about no upstream branch
            error_str = str(e)
            if "no upstream branch" in error_str.lower():
                try:
                    # Extract the branch name from the error message
                    current_branch = self.get_current_branch()
                    # Set upstream and push
                    result = self._run_git_command(["git", "push", "--set-upstream", "origin", current_branch])
                    print(result)
                    return result
                except Exception as push_error:
                    print(push_error)
                    return push_error
            else:
                # If it's a different error, just return it
                print(e)
                return e

    def git_add_commit_push(self, message):
        diff = self.git_diff()
        if not diff:
            raise Exception("No changes to commit")
        add = self.git_add()
        commit = self.git_commit(message)
        push = self.git_push()
        return {
            "add": add,
            "commit": commit,
            "push": push
        }