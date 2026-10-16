import express, { NextFunction, Request, Response } from 'express';

const HTTP_STATUS = {
    OK : 200,
    CREATE : 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR:500
} as const;

// interface definir la estrcutur ade los objetos vacantes
interface Vacancy {
    id: number;
    title: string;
    company: string;
    modality: string;
    salary: number;
}
// Datos que se espera recibir desde el cliente

type CreateVacancyInput = Omit<Vacancy, 'id'>;
// Revisa los datos de entrada. Devuelve el mensaje de error, o null si todo está bien
const validateVacancy = (input: Partial<CreateVacancyInput>): string | null => {
  const { title, company, modality, salary } = input;

  if (typeof title !== 'string' || !title.trim() ||
      typeof company !== 'string' || !company.trim() ||
      typeof modality !== 'string' || !modality.trim()) {
    return 'El título, la empresa y la modalidad son obligatorios';
  }
  if (typeof salary !== 'number' || salary <= 0) {
    return 'El salario debe ser un número mayor que 0';
  }
  return null;
};
const app = express();
//meddleware: convierte el json que llega en un objeto disponible en req.body
app.use(express.json());

// Datos de prueba en memora ()
const vacancies: Vacancy[] = [
    { id: 1, title: 'Desarrollador Frontend', company: 'TechCorp', modality: 'Remoto', salary: 60000 },
    { id: 2, title: 'Desarrollador Backend', company: 'Innovatech', modality: 'Presencial', salary: 70000 },
    { id: 3, title: 'Diseñador UX/UI', company: 'Creativa', modality: 'Híbrido', salary: 50000 },
];
let nextId = vacancies.length + 1;
//Ruta GET /vacancies: Devuelve todas las vacantes
app.get('/vacancies', (req, res) => {
    res.status(HTTP_STATUS.OK).json(vacancies);
});
//Ruta POST /vacancies
app.post('/vacancies', (req, res) => {
    const input = req.body as CreateVacancyInput;
    const error = validateVacancy(input ?? {});
    if (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
        return;
    }
    // crear la nueva vacante
    const newVacancy : Vacancy = {
        id: nextId++,
        title: input.title.trim(),
        company: input.company.trim(),
        modality: input.modality.trim(),
        salary: input.salary
    };
    vacancies.push(newVacancy);
    res.status(HTTP_STATUS.CREATE).json(newVacancy);
});

app.use((req,res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Ruta no encontrada' });
})

// manejo de errores : epress lo reconoce 
app.use((err: Error & {status?: number}, req: Request, res: Response, next: NextFunction) => {
    const status = err.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if(status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) console.error(err);
    res.status(status).json({ 
        error : status < HTTP_STATUS.INTERNAL_SERVER_ERROR ? 'la petición es inválida' : 'Error interno del servidor'
     });
});

export default app;