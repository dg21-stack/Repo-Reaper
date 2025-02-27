import unittest
import sys
import os
import requests
from constants import path

class TestGitAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = "http://127.0.0.1:5000"
        self.repo_path = path
        
    def test_get_branches(self):
        """Test the /get-branches endpoint"""
        response = requests.post(
            f"{self.base_url}/get-branches",
            json={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("branches", data)
        self.assertIsInstance(data["branches"], list)
        
    def test_git_log(self):
        """Test the /git-log endpoint"""
        # First get branches to use a valid branch name
        branches_response = requests.post(
            f"{self.base_url}/get-branches",
            json={"repo_path": self.repo_path}
        )
        branches = branches_response.json()["branches"]
        
        # Use the first branch for testing
        if branches:
            response = requests.post(
                f"{self.base_url}/git-log",
                json={
                    "repo_path": self.repo_path,
                    "branch": branches[0]
                }
            )
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn("git-log", data)
            self.assertIsInstance(data["git-log"], str)
            
    def test_git_reflog(self):
        """Test the /git-reflog endpoint"""
        # First get branches to use a valid branch name
        branches_response = requests.post(
            f"{self.base_url}/get-branches",
            json={"repo_path": self.repo_path}
        )
        branches = branches_response.json()["branches"]
        
        # Use the first branch for testing
        if branches:
            response = requests.post(
                f"{self.base_url}/git-reflog",
                json={
                    "repo_path": self.repo_path,
                    "branch": branches[0]
                }
            )
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn("reflog", data)
            self.assertIsInstance(data["reflog"], list)
            
    def test_invalid_repo_path(self):
        """Test error handling for invalid repo path"""
        response = requests.post(
            f"{self.base_url}/get-branches",
            json={"repo_path": "/invalid/path"}
        )
        self.assertEqual(response.status_code, 500)
    
    def test_add_commit_push(self):
        """Test the /add-commit-push endpoint"""
        response = requests.post(
            f"{self.base_url}/add-commit-push",
            json={"repo_path": self.repo_path, "branch": "main", "message": "test message"}
        )
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main() 