import axios from 'axios';

export default async function sendSlackMessage(webhookUrl: string, data: any) {
  try {
    await axios.post(webhookUrl, data);
  } catch (error) {
    console.error(error);
  }
}
