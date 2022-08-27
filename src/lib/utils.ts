import path from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (url: string) => path.dirname(fileURLToPath(url));

export const getFilename = (url: string) => fileURLToPath(url);
