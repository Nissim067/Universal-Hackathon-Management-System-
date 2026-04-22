export const logger = {
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
    }
  },
  error: (message: string | Error, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`[ERROR] ${new Date().toISOString()} - ${message}\n`);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`[WARN] ${new Date().toISOString()} - ${message}\n`);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      process.stdout.write(`[DEBUG] ${new Date().toISOString()} - ${message}\n`);
    }
  },
};
