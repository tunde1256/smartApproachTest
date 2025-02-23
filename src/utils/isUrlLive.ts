import axios from 'axios';

export const isUrlLive = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { timeout: 5000 });

    if (response.status === 200) {
      return 'The URL is live and reachable.';
    } else {
      return `The URL responded with status code: ${response.status}. It might not be reachable.`;
    }
  } catch (error: Response | any) {
    if (error.response) {
      return `The URL responded with status code: ${error.response.status}. It might not be reachable.`;
    } else if (error.request) {
      return 'No response received from the URL. It might be down or unreachable.';
    } else {
      return `Error occurred while trying to reach the URL: ${error.message}`;
    }
  }
};
