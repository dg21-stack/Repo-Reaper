import re

class DiffMethods:
    def git_diff(self, branch = None):
            if not branch:
                branch = self.current_branch
            result = self._run_git_command(["git", "diff", branch])
            diff_dict = {}

            file_sections = re.findall(
                r'^diff --git a/(.*?) b/.*?\n(.*?)(?=^diff --git|\Z)',
                result,
                flags=re.DOTALL | re.MULTILINE
            )
            
            for file_name, changes in file_sections:
                diff_dict[file_name] = changes.strip()

            return diff_dict
