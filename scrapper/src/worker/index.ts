import { FetchProductsJob } from './jobs/fetch-products';
import { Container } from '../container';
import { UpdatePriceJob } from './jobs/update-price';
import { ProductUpdateJob } from './jobs/products-update';

export interface WorkerJob {
  running: boolean;
  start(): void;
  stop(): void;
}

export class Worker {
  protected jobs: WorkerJob[];

  constructor(container: Container) {
    this.jobs = [
      new FetchProductsJob(container),
      new UpdatePriceJob(container),
      new ProductUpdateJob(container),
    ];
  }

  get jobsCount(): number {
    return this.jobs.length;
  }

  start(): void {
    this.jobs.filter((job) => !job.running).forEach((job) => job.start());
  }

  stop(): void {
    this.jobs.filter((job) => job.running).forEach((job) => job.stop());
  }
}
