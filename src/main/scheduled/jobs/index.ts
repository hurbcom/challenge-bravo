import { scheduleJob } from 'node-schedule'
import { Job } from './protocols/job'

export default async (jobs:Job[]): Promise<void> => {
  jobs.forEach(async (job) => {
    await scheduleJob(job.getName(), job.schedule, async (): Promise<void> => await job.handle())
  })
}
