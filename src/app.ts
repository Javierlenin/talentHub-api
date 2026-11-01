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
import { MongoCompanyRepository } from './modules/companies/adapter/persistence/MongoCompanyRepository';
import { CompanyService } from './modules/companies/application/CompanyService';
import { createCompanyRouter } from './modules/companies/adapter/http/companyRoutes';
import { CompanyRepository } from './modules/companies/ports/CompanyRepository';
import { PrismaVacancyRepository } from './modules/vacancies/adapter/persistence/PrismaVacancyRepository';
import { notFoundHandler, errorHandler } from './shared/httpErrorHandlers';
import { createMongoClient } from './shared/database/mongoClient';
import { createPostgresPool } from './shared/database/postgresPool';
import { createPrismaClient } from './shared/database/prismaClient';
import { PrismaCandidateRepository } from './modules/candidates/adapter/persistence/PrismaCandidateRepository';

const app = express();
app.use(express.json());
// 1- repositroio donde se guarda las
const sampleVacancies = [
    { id: 1, title: 'Software Engineer', company: 'Google', modality: 'remote', salary: 100000 },
    { id: 2, title: 'Analista de Datos', company: 'Microsoft', modality: 'remote', salary: 100000 },
];

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? createPostgresPool(databaseUrl) : undefined;

const createVacancyRepository = (): VacancyRepository => {
  if (!databaseUrl || !pool) {
    return new InMemoryVacancyRepository(sampleVacancies);
  }

  if (process.env.VACANCIES_ADAPTER === 'prisma') {
    return new PrismaVacancyRepository(createPrismaClient(databaseUrl));
  }

  return new PostgresVacancyRepository(pool);
};

const vacancyRepository = createVacancyRepository();
const vacancyService = new VacancyService(vacancyRepository);
app.use('/vacancies', createVacancyRouter(vacancyService));

const createCandidateRepository = (): CandidateRepository => {
  if (!databaseUrl || !pool) {
    return new InMemoryCandidateRepository([]);
  }

  if (process.env.CANDIDATES_ADAPTER === 'prisma') {
    return new PrismaCandidateRepository(createPrismaClient(databaseUrl));
  }

  return new PostgresCandidateRepository(pool);
};



  const candidateRepository = createCandidateRepository ();
  const candidateService = new CandidateService(candidateRepository);
app.use('/candidates', createCandidateRouter(candidateService));


const companyRepository: CompanyRepository = process.env.MONGODB_URI
  ? new MongoCompanyRepository(createMongoClient(process.env.MONGODB_URI))
  : new InMemoryCompanyRepository();



const companyService = new CompanyService(companyRepository);
app.use('/companies', createCompanyRouter(companyService));

app.use(notFoundHandler);
app.use(errorHandler);
export default app;
