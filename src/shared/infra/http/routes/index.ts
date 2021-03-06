// src/routes/index.ts
import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointaments.routes';
import usersRouter from '@modules/users/infra/http/routes//users.routes';
import sessionsRouter from '@modules/users/infra/http/routes//sessions.router';

const routes = Router();
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
