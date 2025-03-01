from MethodBundles.GitRepoSessionBase import GitRepoSessionBase
from MethodBundles.BranchMethods import BranchMethods
from MethodBundles.ReflogMethods import ReflogMethods

class GitRepoSession(GitRepoSessionBase, BranchMethods, ReflogMethods):
    """
    Git Repository Session class that combines functionality from multiple modules.
    
    This class inherits from:
    - GitRepoSessionBase: Core functionality and properties
    - BranchMethods: Branch-related operations
    - ReflogMethods: Reflog-related operations
    """
    pass