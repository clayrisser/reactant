import 'babel-polyfill';
import express from 'express';
import initServer from 'reaction-base/init/server';

const app = express();
const initialProps = {};

export default initServer(initialProps, app);
