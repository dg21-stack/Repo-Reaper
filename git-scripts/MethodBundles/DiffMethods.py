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
            staged_files, unstaged_files = self.git_status()
            has_staging = len(staged_files) > 0
            has_unstaged = len(unstaged_files) > 0

            for file_name, changes in file_sections:
                split_name = file_name.split('/')
                for i in range(len(split_name)):
                    path = '/'.join(split_name[:i+1])
                    diff_dict[path] = {"diff": None if i != len(split_name) - 1 else changes.strip(), 
                                    "id": path,
                                    "path": path,
                                    "type": "folder" if i != len(split_name) - 1 else "file",
                                    "name": split_name[i],
                                    "level": i,
                                    "staged": path in staged_files,
                                    "unstaged": path in unstaged_files
                                    }

                
            returning_dict = {
            "diff_dict": diff_dict,
            "hasStaging": has_staging,
            "hasUnstaged": has_unstaged
            }

            return returning_dict

    def git_status(self, branch = None):
        if not branch:
            branch = self.current_branch
        
        result = self._run_git_command(["git", "status"])
        
        staged_files = []
        unstaged_files = []
        
        if "Changes to be committed" in result:
            staged_section = result.split("Changes to be committed")[-1].split("Changes not staged for commit")[0]
            staged_files = re.findall(r"modified:\s+([^\s]+)", staged_section)
        
        if "Changes not staged for commit" in result:
            unstaged_section = result.split("Changes not staged for commit")[-1].split("Untracked files")[0]
            unstaged_files = re.findall(r"modified:\s+([^\s]+)", unstaged_section)

        return set(staged_files), set(unstaged_files)



                
                
                    
                    