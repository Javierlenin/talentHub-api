import { Pool } from 'pg';

import { NewVacancy, Vacancy } from '../../domain/Vacancy';
import { VacancyRepository } from '../../ports/VacancyRepository';

// Forma de una fila de la tabla vacancies. NUMERIC llega como texto desde PostgreSQL.
type VacancyRow = {
  id: number;
  title: string;
  company: string;
  modality: string;
  salary: string;
};

const COLUMNS = 'id, title, company, modality, salary';

const toVacancy = (row: VacancyRow): Vacancy => ({
  id: row.id,
  title: row.title,
  company: row.company,
  modality: row.modality,
  salary: Number(row.salary),
});

// Adaptador de salida: cumple VacancyRepository usando PostgreSQL.
export class PostgresVacancyRepository implements VacancyRepository {
  constructor(private readonly pool: Pool) {}

  //listar vacantes
  findAll = async (): Promise<Vacancy[]> => {
    const result = await this.pool.query<VacancyRow>(`SELECT ${COLUMNS} FROM vacancies ORDER BY id`);
    return result.rows.map(toVacancy);
  };

  findById = async (id: number): Promise<Vacancy | undefined> => {
    const result = await this.pool.query<VacancyRow>(`SELECT ${COLUMNS} FROM vacancies WHERE id = $1`, [id]);
    return result.rows[0] ? toVacancy(result.rows[0]) : undefined;
  };

  save = async (newVacancy: NewVacancy): Promise<Vacancy> => {
    const result = await this.pool.query<VacancyRow>(
      `INSERT INTO vacancies (title, company, modality, salary)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [newVacancy.title, newVacancy.company, newVacancy.modality, newVacancy.salary],
    );
    return toVacancy(result.rows[0]);
  };

  update = async (id: number, data: NewVacancy): Promise<Vacancy | undefined> => {
    const result = await this.pool.query<VacancyRow>(
      `UPDATE vacancies
       SET title = $1, company = $2, modality = $3, salary = $4
       WHERE id = $5
       RETURNING ${COLUMNS}`,
      [data.title, data.company, data.modality, data.salary, id],
    );
    return result.rows[0] ? toVacancy(result.rows[0]) : undefined;
  };

  remove = async (id: number): Promise<boolean> => {
    const result = await this.pool.query('DELETE FROM vacancies WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  };
}
