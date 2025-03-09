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

    def git_status(self, branch = None):
        if not branch:
            branch = self.current_branch
        
        # Run the git status command
        result = self._run_git_command(["git", "status"])
        
        # Initialize lists for staged and unstaged files
        staged_files = []
        unstaged_files = []
        
        # Check if there are changes to be committed (staged changes)
        if "Changes to be committed" in result:
            # Extract the section for staged changes
            staged_section = result.split("Changes to be committed")[-1].split("Changes not staged for commit")[0]
            # Find all modified files in the staged section
            staged_files = re.findall(r"modified:\s+([^\s]+)", staged_section)
        
        # Check if there are changes not staged for commit (unstaged changes)
        if "Changes not staged for commit" in result:
            # Extract the section for unstaged changes
            unstaged_section = result.split("Changes not staged for commit")[-1].split("Untracked files")[0]
            # Find all modified files in the unstaged section
            unstaged_files = re.findall(r"modified:\s+([^\s]+)", unstaged_section)
        
        # Check if there are any staged changes
        has_staging = len(staged_files) > 0
        has_unstaged = len(unstaged_files) > 0
        
        # Return structured dictionary
        returning_dict = {
            "result": {
                "staged": staged_files,
                "unstaged": unstaged_files,
            },
            "hasStaging": has_staging,
            "hasUnstaged": has_unstaged
        }
        return returning_dict


                
                
                    
                    