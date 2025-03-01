import unittest
import sys
import os
import requests
from constants import path
import time

class TestGitAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = "http://127.0.0.1:5000"
        self.repo_path = path


    def test_get_branches(self):
        """Test the GET /branches endpoint"""
        response = requests.get(
            f"{self.base_url}/branches",
            params={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("branches", data)
        self.assertIsInstance(data["branches"], list)


    def test_create_branch(self):
        """Test the POST /branches/<branch> endpoint"""
        # Create a unique test branch name with timestamp
        test_branch = f"test-branch-{int(time.time())}"
        response = requests.post(
            f"{self.base_url}/branches/{test_branch}",
            json={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("branch", data)
        self.assertEqual(data["branch"], test_branch)
        # Clean up by deleting the branch we created
        requests.delete(
            f"{self.base_url}/branches/{test_branch}",
            json={"repo_path": self.repo_path}
        )

    def test_delete_branch(self):
        """Test the DELETE /branches/<branch> endpoint"""
        # First create a branch to delete
        test_branch = f"test-delete-branch-{int(time.time())}"
        # Create branch
        create_response = requests.post(
        f"{self.base_url}/branches/{test_branch}",
        json={"repo_path": self.repo_path}
        )
        # Now delete the branch
        delete_response = requests.delete(
        f"{self.base_url}/branches/{test_branch}",
        json={"repo_path": self.repo_path}
        )
        self.assertEqual(delete_response.status_code, 200)
        data = delete_response.json()
        self.assertIn("branch", data)
        self.assertEqual(data["branch"], test_branch)


    def test_switch_branch(self):
        """Test the POST /branches/<branch>/switch endpoint"""
        # Get available branches
        branches_response = requests.get(
            f"{self.base_url}/branches",
            params={"repo_path": self.repo_path}
        )
        branches = branches_response.json()["branches"]
        # Make sure we have at least one branch to switch to
        self.assertTrue(len(branches) > 0, "Repository needs at least one branch for testing")
        # Switch to the first branch
        target_branch = branches[0]
        response = requests.post(
            f"{self.base_url}/branches/{target_branch}/switch",
            json={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("branch", data)
        self.assertEqual(data["branch"], target_branch)


    def test_get_current_branch(self):
        """Test the GET /branches/current endpoint"""
        response = requests.get(
            f"{self.base_url}/branches/current",
            params={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("branch", data)
        self.assertIsInstance(data["branch"], str)

    def test_git_log_all_branches(self):
        """Test the GET /branches/log endpoint"""
        response = requests.get(
            f"{self.base_url}/branches/log",
            params={"repo_path": self.repo_path}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("result", data)
        
        # Verify the structure of the result
        result = data["result"]
        self.assertIn("branchHistory", result)
        self.assertIn("repo_name", result)
        
        # Verify branch history is a list
        branch_history = result["branchHistory"]
        self.assertIsInstance(branch_history, list)
        
        # If we have branches, verify their structure
        if branch_history:
            branch = branch_history[0]
            self.assertIn("branch", branch)
            self.assertIn("commitHistory", branch)
            self.assertIn("lastUpdatedTime", branch)
            
            # If we have commits, verify their structure
            if branch["commitHistory"]:
                commit = branch["commitHistory"][0]
                self.assertIn("id", commit)
                self.assertIn("message", commit)
                self.assertIn("time", commit)
    
    def test_git_log_specific_branch(self):
        """Test the GET /branches/<branch>/log endpoint"""
        # Get available branches first to ensure we have a valid branch
        branches_response = requests.get(
            f"{self.base_url}/branches",
            params={"repo_path": self.repo_path}
        )
        branches = branches_response.json()["branches"]
        # Make sure we have at least one branch to test with
        self.assertTrue(len(branches) > 0, "Repository needs at least one branch for testing")
        # Test with the first branch
        test_branch = branches[0]
        response = requests.get(
            f"{self.base_url}/branches/{test_branch}/log",
            params={"repo_path": self.repo_path}
        )
        # Verify response code and basic structure
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Verify all required fields are present
        self.assertIn("branch", data)
        self.assertIn("git-log", data)
        self.assertIn("repo-path", data)
        # Verify the branch name matches
        self.assertEqual(data["branch"], test_branch)
        # Verify repo path
        self.assertEqual(data["repo-path"], self.repo_path)
        # Verify git-log structure
        git_log = data["git-log"]
        self.assertIn("branchHistory", git_log)
        self.assertIn("lastUpdatedTime", git_log)
        # Verify lastUpdatedTime is a number
        self.assertIsInstance(git_log["lastUpdatedTime"], int)
        # Verify branchHistory is a list
        branch_history = git_log["branchHistory"]
        self.assertIsInstance(branch_history, list)
        # If we have commits, verify their structure
        if branch_history:
            commit = branch_history[0] # Check first commit
            self.assertIn("id", commit)
            self.assertIn("message", commit)
            self.assertIn("time", commit)
            # Verify types of commit fields
            self.assertIsInstance(commit["id"], str)
            self.assertIsInstance(commit["message"], str)
            self.assertIsInstance(commit["time"], int)


if __name__ == '__main__':
    unittest.main()