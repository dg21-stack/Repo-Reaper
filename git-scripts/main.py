from flask import Flask, request, jsonify
import requests
import json 
import os 
from methods.gitlog import run_git_log
from methods.getBranches import get_repo_branches

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)

