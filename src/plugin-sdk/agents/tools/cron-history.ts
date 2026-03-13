import * as path from 'path';
import * as os from 'os';
import { promises as fs } from 'fs';

interface ArchivedTask {
  id: string;
  name: string;
  schedule: any;
  task: any;
  delivery: any;
  completedAt: string;
  status: 'success' | 'failed';
  output?: string;
}

const HISTORY_FILE = path.join(os.homedir(), '.openclaw', 'cron', 'history.json');

export async function archiveTask(task: any, result: { success: boolean; output?: string }): Promise<void> {
  let history = { completed: [] as ArchivedTask[] };
  
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8');
    history = JSON.parse(data);
  } catch {
    // File doesn't exist, use default
  }
  
  history.completed.push({
    id: task.id,
    name: task.name,
    schedule: task.schedule,
    task: task.task,
    delivery: task.delivery,
    completedAt: new Date().toISOString(),
    status: result.success ? 'success' : 'failed',
    output: result.output
  });
  
  await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}
