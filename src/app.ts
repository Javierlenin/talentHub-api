import express from 'express';
import { InMemoryVacancyRepository } from './modules/vacancies/adapter/persistence/InMemoryVacancyRepository';
import { PostgresVacancyRepository } from './modules/vacancies/adapter/persistence/PostgresVacancyRepository';
import { VacancyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRouter } from './modules/vacancies/adapter/http/VacancyRoutes';
import { VacancyRepository } from './modules/vacancies/ports/VacancyRepository';
import { InMemoryCandidateRepository } from './modules/candidates/adapter/persistence/InMemoryCandidateRepository';
import { PostgresCandidateRepository } from './modules/candidates/adapter/persistence/PostgresCandidateRepository';
import { CandidateService } from './modules/candidates/application/CandidateService';
import { createCandidateRouter } from './modules/candidates/adapter/http/candidateRoutes';
import { CandidateRepository } from './modules/candidates/ports/CandidateRepository';
import { InMemoryCompanyRepository } from './modules/companies/adapter/persistence/InMemoryCompanyRepository';
import { CompanyService } from './modules/companies/application/CompanyService';
import { createCompanyRouter } from './modules/companies/adapter/http/companyRoutes';
import { notFoundHandler, errorHandler } from './shared/httpErrorHandlers';
import { createPostgresPool } from './shared/database/postgresPool';

const app = express();
app.use(express.json());
// 1- repositroio donde se guarda las
const sampleVacancies = [
    { id: 1, title: 'Software Engineer', company: 'Google', modality: 'remote', salary: 100000 },
    { id: 2, title: 'Analista de Datos', company: 'Microsoft', modality: 'remote', salary: 100000 },
];

// El dominio no elige dónde se guardan los datos. Aquí se enchufa un adaptador u otro.
const pool = process.env.DATABASE_URL ? createPostgresPool(process.env.DATABASE_URL) : undefined;

// guardando las vacantes 
const vacancyRepository: VacancyRepository = pool
    ? new PostgresVacancyRepository(pool)
    : new InMemoryVacancyRepository(sampleVacancies);

const candidateRepository: CandidateRepository = pool
    ? new PostgresCandidateRepository(pool)
    : new InMemoryCandidateRepository();

const vacancyService = new VacancyService(vacancyRepository);
app.use('/vacancies', createVacancyRouter(vacancyService));

const candidateService = new CandidateService(candidateRepository);
app.use('/candidates', createCandidateRouter(candidateService));

const companyService = new CompanyService(new InMemoryCompanyRepository());
app.use('/companies', createCompanyRouter(companyService));

app.use(notFoundHandler);
app.use(errorHandler);
export default app;
