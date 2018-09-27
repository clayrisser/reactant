import 'babel-polyfill';
import express from 'express';
import initServer from '@reactant/base/lib/init/server';

const app = express();
const initialProps = {};

export default initServer(initialProps, app);
