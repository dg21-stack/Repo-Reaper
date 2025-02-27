from flask import Flask, request, jsonify
import requests
import json 
import os 
from methods.createBranch import create_git_branch
from methods.deleteBranch import delete_git_branch
from methods.gitlog import run_git_log_all_branch, run_git_log_specific_branch  
from methods.getBranches import get_repo_branches, get_repo_branch
from methods.gitReflog import get_reflog

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/log-branch/<branch>', methods=['POST'])
def git_log_specific_branch(branch):
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    result = run_git_log_specific_branch(repo_path, branch)
    return jsonify({"result": result})

@app.route('/log-branch/all', methods=['POST'])
def git_log_all_branches():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    result = run_git_log_all_branch(repo_path)
    return jsonify({"result": result})


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
    if not data or 'repo_path' not in data or 'branch' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400
    
    repo_path = data['repo_path']
    branch = data['branch']
    result = get_reflog(repo_path, branch)
    return jsonify({"repo-path": repo_path, "branch": branch, "reflog": result})

@app.route('/create-branch', methods=['POST'])
def create_branch(): 
    data = request.get_json()
    if not data or 'repo_path' not in data or 'branch' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    repo_path = data['repo_path']
    branch = data['branch']
    try: 
        return jsonify({"result":create_git_branch(repo_path, branch)})
    except:
        return jsonify({"error": str(e)}), 500
    
@app.route('/delete-branch', methods=['POST'])
def delete_branch(): 
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    repo_path = data['repo_path']
    branch = data['branch']
    try: 
        return jsonify({"result":delete_git_branch(repo_path, branch)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-current-branch', methods=['POST'])
def get_current_branch():
    data = request.get_json()
    if not data or 'repo_path' not in data:
        return jsonify({"error": "Missing repo_path in request body"}), 400

    try:
        return jsonify({"branch":get_repo_branch(data['repo_path'])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

