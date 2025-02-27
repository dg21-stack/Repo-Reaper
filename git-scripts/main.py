from flask import Flask, request, jsonify
import requests
import json 
import os 
from methods.gitlog import run_git_log  
from methods.getBranches import get_repo_branches
from methods.gitReflog import get_reflog
from methods.addCommitPush import add_commit_push
from methods.gitDiff import git_diff
from methods.gitStash import git_stash, git_stash_pop, git_stash_list
app = Flask(__name__)
####
@app.route('/')
def index():
    return "Hello, World!"

@app.route('/git-log', methods=['POST'])
def git_log():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = run_git_log(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "git-log": result})

@app.route('/get-branches', methods=['POST'])
def get_branches():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']

    result = get_repo_branches(repo_path)
    return jsonify({"repo-path": repo_path, "branches": result})

@app.route('/git-reflog', methods=['POST'])
def git_reflog():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = get_reflog(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "reflog": result})

@app.route('/add-commit-push', methods=['POST'])
def git_add_commit_push():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    message = data['message']
    branch = data['branch']
    result = add_commit_push(repo_path, branch, message)
    return jsonify({"repo-path": repo_path, "branch": branch, "message": message, "result": result})

@app.route('/git-diff', methods=['POST'])
def gitDiff():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_diff(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/git-stash', methods=['POST'])
def git_stash():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/git-stash-pop', methods=['POST'])
def git_stash_pop():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash_pop(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

@app.route('/git-stash-list', methods=['POST'])
def git_stash_list():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = git_stash_list(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "result": result})

if __name__ == '__main__':
    app.run(debug=True)

