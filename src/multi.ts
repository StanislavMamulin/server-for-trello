import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { createServer } from './Server/createServer';

const numCPUs = cpus().length;

const clustStarter = () => {
    const worker = cluster.fork();

    worker.on('online', () => {
        console.info(`Worker ${worker.id} started`);
    });
    worker.on('exit', (code, signal) => {
        if (signal) {
            console.log(`worker was killed by signal: ${signal}`);
        } else {
            console.info(`worker ${worker.id} died`);
            clustStarter();
        }
    });
};

if (cluster.isPrimary) {
    for (let index = 0; index < numCPUs; index++) {
        clustStarter();
    }
} else {
    createServer();
}
