import express from 'express';
import { InMemoryVacancyRepository } from './modules/vacancies/adapter/persistence/InMemoryVacancyRepository';
import { VacancyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRouter } from './modules/vacancies/adapter/http/VacancyRoutes';
import { notFoundHandler, errorHandler } from './shared/httpErrorHandlers';

const app = express();
app.use(express.json());
// repositorio donde se guardan las vacantes
const vacancyRepository = new InMemoryVacancyRepository([
    {id:1,title:'Software Engineer',company:'Google',modality:'remote',salary:100000},
    {id:2,title:'Analista de Datos',company:'Microsoft',modality:'remote',salary:100000},
]);
// servicio casos de uso
const vacancyService = new VacancyService(vacancyRepository);
// rutas : se entrega el servicio y se monta bajo el prefijo  /vacancies
app.use('/vacancies', createVacancyRouter(vacancyService));

app.use(notFoundHandler);
// manejadores de errores
app.use(errorHandler);
export default app;