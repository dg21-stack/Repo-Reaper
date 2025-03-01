from MethodBundles.GitRepoSessionBase import GitRepoSessionBase
from MethodBundles.BranchMethods import BranchMethods
from MethodBundles.ReflogMethods import ReflogMethods
from MethodBundles.LogMethods import LogMethods
from MethodBundles.DiffMethods import DiffMethods
from MethodBundles.CommitMethods import CommitMethods   

class GitRepoSession(GitRepoSessionBase, BranchMethods, ReflogMethods, LogMethods, DiffMethods, CommitMethods):
    """
    Git Repository Session class that combines functionality from multiple modules.
    
    This class inherits from:
    - GitRepoSessionBase: Core functionality and properties
    - BranchMethods: Branch-related operations
    - ReflogMethods: Reflog-related operations
    """
    pass