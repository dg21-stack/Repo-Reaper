import axios from "axios";
import { getConfig } from "../config/url-config";

const { APIUrl } = getConfig();

// Set active repository
export const setActiveRepo = async (repoPath: string): Promise<any> => {
    const URL = `${APIUrl}/repo`;
  
    const result = await axios.post(URL, {
      repo_path: repoPath,
    });
  
    return result.data;
  };
  
  // Get active repository
  export const getActiveRepo = async (): Promise<any> => {
    const URL = `${APIUrl}/repo`;
  
    const result = await axios.get(URL);
  
    return result.data;
  };