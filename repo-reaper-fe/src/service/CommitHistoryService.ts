import axios from "axios";
import { getConfig } from "../config/url-config";

const { APIUrl } = getConfig();

// Get all branches
export const getAllBranches = async (): Promise<any> => {
  const URL = `${APIUrl}/branches`;

  const result = await axios.get(URL);

  return result.data;
};

// Create a new branch
export const createBranch = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/${branch}`;

  const result = await axios.post(URL);

  return result.data;
};

// Delete a branch
export const deleteBranch = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/${branch}`;

  const result = await axios.delete(URL);

  return result.data;
};

// Switch to a branch
export const switchBranch = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/${branch}/switch`;

  const result = await axios.post(URL);

  return result.data;
};

// Get the current branch
export const getCurrentBranch = async (): Promise<any> => {
  const URL = `${APIUrl}/branches/current`;

  const result = await axios.get(URL);

  return result.data;
};

// Get logs for all branches
export const getAllLogs = async (): Promise<any> => {
  const URL = `${APIUrl}/branches/log`;

  const result = await axios.get(URL);

  return result.data;
};

// Get logs for a specific branch
export const getLogsForBranch = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/${branch}/log`;

  const result = await axios.get(URL);

  return result.data;
};

// Get reflog for a branch
export const getReflog = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/${branch}/reflog`;

  const result = await axios.get(URL);

  return result.data;
};

// Add, commit, and push changes
export const addCommitPush = async (message: string): Promise<any> => {
  const URL = `${APIUrl}/branches/current/add-commit-push`;

  const result = await axios.post(URL, {
    message: message,
  });

  return result.data;
};
export const addAll = async (): Promise<any> => {
  const URL = `${APIUrl}/branches/current/add-all`;

  const result = await axios.post(URL, {
    message: ""
    });

  return result.data;
};
export const addSpecific = async (file_list: string[]): Promise<any> => {
  const URL = `${APIUrl}/branches/current/add-specific`;
  const result = await axios.post(URL, {
    file_list
    });

  return result.data;
}
export const commit = async (message: string): Promise<any> => {
  const URL = `${APIUrl}/branches/current/commit`;

  const result = await axios.post(URL, {
    message: message,
  });

  return result.data;
};
export const push = async (): Promise<any> => {
  const URL = `${APIUrl}/branches/current/push`;

  const result = await axios.post(URL, {
    message: "push"
  });

  return result.data;
};

// Get diff between branches
export const getDiff = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/current/diff/${branch}`;

  const result = await axios.get(URL);

  return result.data;
};

export const getStatus = async (branch: string): Promise<any> => {
  const URL = `${APIUrl}/branches/current/status/${branch}`;

  const result = await axios.get(URL);

  return result.data;
};

// Stash changes
export const stashChanges = async (repoPath: string, branch: string): Promise<any> => {
  const URL = `${APIUrl}/stash`;

  const result = await axios.post(URL, {
    repo_path: repoPath,
    branch: branch,
  });

  return result.data;
};

// List stashes
export const listStashes = async (repoPath: string, branch: string): Promise<any> => {
  const URL = `${APIUrl}/stash`;

  const result = await axios.get(URL, {
    params: { repo_path: repoPath, branch: branch },
  });

  return result.data;
};

// Pop a stash
export const popStash = async (repoPath: string, branch: string): Promise<any> => {
  const URL = `${APIUrl}/stash/pop`;

  const result = await axios.post(URL, {
    repo_path: repoPath,
    branch: branch,
  });

  return result.data;
};
