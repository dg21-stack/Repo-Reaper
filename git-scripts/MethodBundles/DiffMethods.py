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
            staged_files, unstaged_files = self._get_staged_and_unstaged()
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

    def _get_staged_and_unstaged(self, branch = None):
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
    
    def git_status(self, branch=None):
        staged_files, unstaged_files = self._get_staged_and_unstaged(branch)

        # Flat dictionary for file/folder structure
        file_structure = {}
        # Single-dimensional dictionary for file status
        file_status = {}

        def add_to_structure(file_list):
            for i in range(len(file_list)):
                current_name = file_list[i]
                is_file = i == len(file_list) - 1

                if current_name not in file_structure:
                    file_structure[current_name] = {
                        "type": "file" if is_file else "folder",
                        "children": set(),  # Use a set to avoid duplicates,
                        "path": '/'.join(file_list[:i+1])
                    }

                if i > 0:
                    parent_name = file_list[i - 1]
                    file_structure[parent_name]["children"].add(current_name)

        def add_to_status(file_list, status):
            file_name = file_list[-1]  # Last element is the file name
            if file_name not in file_status:
                file_status[file_name] = {"staged": False, "nonstaged": False}
            file_status[file_name][status] = True

        # Process staged files
        for file in staged_files:
            file_list = file.split('/')
            add_to_structure(file_list)
            add_to_status(file_list, "staged")

        # Process unstaged files
        for file in unstaged_files:
            file_list = file.split('/')
            add_to_structure(file_list)
            add_to_status(file_list, "nonstaged")

        # Convert sets to lists for the final output
        for name, node in file_structure.items():
            node["children"] = list(node["children"])

        top_level_files = [
            name
            for name,node in file_structure.items()
            if not any(name in node_children["children"] for node_children in file_structure.values())
        ]

        return {
            "structure": file_structure,
            "status": file_status,
            "top_level_files": top_level_files,
        }