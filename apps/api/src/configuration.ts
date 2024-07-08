export default () => ({
  api: {
    version: process.env.API_VERSION || 'v1.0.0',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
  },
  health: {
    diskRootPath: process.env.HEALTH_DISK_ROOT_PATH || '/',
    diskThresholdGb: parseInt(process.env.HEALTH_DISK_THRESHOLD_GB ?? '1'),
    memoryThresholdMb: parseInt(
      process.env.HEALTH_MEMORY_THRESHOLD_MB ?? '100',
    ),
  },
});
