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
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
repo_manager = GitRepositoryManager()

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/branches', methods=['GET'])
def get_branches():
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    result = repo_manager.get_repo_session(repo_path).get_branches()
    return jsonify({"repo-path": repo_path, "branches": result})

@app.route('/branches/<branch>', methods=['POST'])
def create_branch(branch): 
    data = request.get_json()

    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400

    try: 
        result = repo_manager.get_repo_session(repo_path).create_git_branch(branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/<branch>', methods=['DELETE'])
def delete_branch(branch): 
    data = request.get_json()
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400

    try: 
        result = repo_manager.get_repo_session(repo_path).delete_git_branch(branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/<branch>/switch', methods=['POST'])
def switch_branch(branch):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400
    
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        repo_session = repo_manager.get_repo_session(repo_path)
        result = repo_session.switch_branch(branch)
        
        if repo_path == repo_manager.get_active_repo_path():
            repo_manager.set_active_branch(branch)
        
        return jsonify({
            "repo-path": repo_path, 
            "branch": branch, 
            "result": result,
            "is_active_repo": (repo_path == repo_manager.get_active_repo_path())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/current', methods=['GET'])
def get_current_branch():
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400

    try:
        return jsonify({"branch": repo_manager.get_repo_session(repo_path)._get_current_branch()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/log', methods=['GET'])
def git_log_all_branches():
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400

    result = repo_manager.get_repo_session(repo_path).git_log_all()
    return jsonify({"result": result})

@app.route('/branches/<branch>/log', methods=['GET'])
def git_log_specific_branch(branch):
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_log_specific_branch(branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "git-log": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/<branch>/reflog', methods=['GET'])
def git_reflog(branch):
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400

    result = repo_manager.get_repo_session(repo_path).get_reflog_specific_branch(branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "reflog": result})


@app.route('/branches/current/add-all', methods=['POST'])
def git_add_all():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing message in request body"}), 400
    
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_add_all_files()
        return jsonify({"repo-path": repo_path, "branch": repo_manager.get_active_branch(),"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/branches/current/add-specific', methods=['POST'])
def git_add_specific():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Missing message in request body"}), 400
    file_list = data.get("file_list")
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_add_specific_files(file_list)
        return jsonify({"repo-path": repo_path, "branch": repo_manager.get_active_branch(),"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/current/commit', methods=['POST'])
def git_commit():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Missing message in request body"}), 400
    
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        print('reached')
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    message = data['message']
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_commit(message)
        return jsonify({"repo-path": repo_path, "branch": repo_manager.get_active_branch(), "message": message, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/branches/current/push', methods=['POST'])
def git_push():
    data = request.get_json()

    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
        
    try:
        result = repo_manager.get_repo_session(repo_path).git_push()
        return jsonify({"repo-path": repo_path, "branch": repo_manager.get_active_branch(), "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/branches/current/add-commit-push', methods=['POST'])
def git_add_commit_push():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Missing message in request body"}), 400
    
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    message = data['message']
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_add_commit_push(message)
        return jsonify({"repo-path": repo_path, "branch": repo_manager.get_active_branch(), "message": message, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/branches/current/diff/<branch>', methods=['GET'])
def gitDiff(branch):
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_diff(branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/branches/current/status/<branch>', methods=['GET'])
def gitStatusAndDiff(branch):
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_status(branch)
        return jsonify({"repo-path": repo_path, "branch": branch, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stash', methods=['POST'])
def stash_changes():
    data = request.get_json()
    
    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_stash()
        return jsonify({"repo-path": repo_path, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stash', methods=['GET'])
def list_stashes():
    repo_path = request.args.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_stash_list()
        return jsonify({"repo-path": repo_path, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stash/pop', methods=['POST'])
def pop_stash():
    data = request.get_json()

    repo_path = data.get("repo_path")
    if not repo_path:
        repo_path = repo_manager.get_active_repo_path()
    
    if not repo_path:
        return jsonify({"error": "No repo_path provided and no active repository selected"}), 400
    
    try:
        result = repo_manager.get_repo_session(repo_path).git_stash_pop()
        return jsonify({"repo-path": repo_path, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
            "current_branch": repo_session.current_branch
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)