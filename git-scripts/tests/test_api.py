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


if __name__ == '__main__':
    unittest.main()