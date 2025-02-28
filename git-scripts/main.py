from flask import Flask, request, jsonify
from methods.createBranch import create_git_branch
from methods.deleteBranch import delete_git_branch
from methods.gitlog import run_git_log_all_branch, run_git_log_specific_branch  
from methods.getBranches import get_repo_branches, get_repo_branch
from methods.gitReflog import get_reflog
from methods.addCommitPush import add_commit_push
from methods.gitDiff import git_diff
from methods.gitStash import git_stash, git_stash_pop, git_stash_list
from GitRepositoryManager import GitRepositoryManager
app = Flask(__name__)

repo_manager = GitRepositoryManager()
####
@app.route('/')
def index():
    return "Hello, World!"

@app.route('/branches', methods=['GET'])
def get_branches():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']

    result = repo_manager.get_repo_session(repo_path).get_branches()
    return jsonify({"repo-path": repo_path, "branches": result})


@app.route('/branches/<branch>', methods=['POST'])
def create_branch(branch): 
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    repo_path = data['repo_path']
    try: 
        return jsonify({"result":create_git_branch(repo_path, branch)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/branches/<branch>', methods=['DELETE'])
def delete_branch(branch): 
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    repo_path = data['repo_path']
    try: 
        return jsonify({"result":delete_git_branch(repo_path, branch)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/<branch>/switch', methods=['POST'])
def switch_branch(branch):
    data = request.get_json()
    
    # If repo_path not provided, use the active repository
    if 'repo_path' not in data:
        # Make sure we have an active repository
        if repo_manager.get_active_repo_path() is None:
            return jsonify({"error": "No active repository selected and no repo_path provided"}), 400
    
    
    repo_path = data.get('repo_path')  # This might be None
    
    try:
        repo_session = repo_manager.get_repo_session(repo_path)
        result = repo_session.switch_branch(branch)
        
        # Use the actual repo_path that was used
        actual_repo_path = repo_path if repo_path else repo_manager.get_active_repo_path()
        
        # Update the global active branch if we're working with the active repo
        if actual_repo_path == repo_manager.get_active_repo_path():
            repo_manager.set_active_branch(branch)
        
        return jsonify({
            "repo-path": actual_repo_path, 
            "branch": branch, 
            "result": result,
            "is_active_repo": (actual_repo_path == repo_manager.get_active_repo_path())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/current', methods=['GET'])
def get_current_branch():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    try:
        return jsonify({"branch":get_repo_branch(data['repo_path'])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/branches/log', methods=['GET'])
def git_log_all_branches():
    data = request.get_json()
    if 'repo_path' not in data:
        if repo_manager.get_active_repo_path() is None:
            return jsonify({"error": "No active repository selected and no repo_path provided"}), 400
        repo_path = repo_manager.get_active_repo_path()
    else:
        repo_path = data['repo_path']
    
    result = run_git_log_all_branch(repo_path)
    return jsonify({"result": result})

@app.route('/branches/<branch>/log', methods=['GET'])
def git_log_specific_branch(branch):
    data = request.get_json()
    
    # If repo_path not provided, use the active repository
    if 'repo_path' not in data:
        if repo_manager.get_active_repo_path() is None:
            return jsonify({"error": "No active repository selected and no repo_path provided"}), 400
        repo_path = repo_manager.get_active_repo_path()
    else:
        repo_path = data['repo_path']
    
    try:
        result = run_git_log_specific_branch(repo_path, branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "git-log": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/<branch>/reflog', methods=['GET'])
def git_reflog(branch):
    data = request.get_json()
    if repo_manager.get_active_repo_path() is None:
        repo_path = data['repo_path']
    else:
        repo_path = repo_manager.get_active_repo_path()

    result = get_reflog(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "reflog": result})
    
@app.route('/branches/current/add-commit-push', methods=['POST'])
def git_add_commit_push():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    

    if repo_manager.get_active_repo_path() is None:
        repo_path = data['repo_path']
    else:
        repo_path = repo_manager.get_active_repo_path()
    
    if repo_manager.get_active_branch() is None:
        branch = data['branch']
    else:
        branch = repo_manager.get_active_branch()
    message = data['message']
    result = add_commit_push(repo_path, message)
    return jsonify({"repo-path": repo_path, "branch": branch, "message": message, "result": result})

@app.route('/branches/current/diff/<branch>', methods=['GET'])
def gitDiff(branch):
    data = request.get_json()
    if repo_manager.get_active_repo_path() is None:
        repo_path = data['repo_path']
    else:
        repo_path = repo_manager.get_active_repo_path()
    
    repo_path = data['repo_path']
    result = git_diff(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/stash', methods=['POST'])
def git_stash():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/stash', methods=['GET'])
def git_stash_list():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash_list(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/stash/pop', methods=['POST'])
def git_stash_pop():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash_pop(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})


@app.route('/repo', methods=['POST'])
def set_active_repo():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    
    try:
        repo_session = repo_manager.set_active_repo(repo_path)
        return jsonify({
            "status": "success", 
            "active_repo": repo_path,
            "current_branch": repo_session.current_branch
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/repo', methods=['GET'])
def get_active_repo():
    try:
        active_repo_path = repo_manager.get_active_repo_path()
        if active_repo_path is None:
            return jsonify({"status": "no_active_repo", "message": "No active repository selected"})
        
        active_branch = repo_manager.get_active_branch()
        repo_session = repo_manager.get_repo_session()
        
        return jsonify({
            "status": "success",
            "active_repo": active_repo_path,
            "active_branch": active_branch,
            "current_branch": repo_session.current_branch  # This might differ from active_branch if changed externally
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)