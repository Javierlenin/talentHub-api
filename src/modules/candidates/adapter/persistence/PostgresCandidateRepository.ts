import { Pool } from 'pg';

import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

type CandidateRow = {
  id: number;
  name: string;
  email: string;
  city: string;
  experience_years: number;
};

const COLUMNS = 'id, name, email, city, experience_years';

const toCandidate = (row: CandidateRow): Candidate => ({
  id: row.id,
  name: row.name,
  email: row.email,
  city: row.city,
  experience_years: Number(row.experience_years),
});

// Adaptador de salida: cumple CandidateRepository usando PostgreSQL.
export class PostgresCandidateRepository implements CandidateRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (): Promise<Candidate[]> => {
    const result = await this.pool.query<CandidateRow>(`SELECT ${COLUMNS} FROM candidates ORDER BY id`);
    return result.rows.map(toCandidate);
  };

  findById = async (id: number): Promise<Candidate | undefined> => {
    const result = await this.pool.query<CandidateRow>(`SELECT ${COLUMNS} FROM candidates WHERE id = $1`, [id]);
    return result.rows[0] ? toCandidate(result.rows[0]) : undefined;
  };

  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const result = await this.pool.query<CandidateRow>(
      `INSERT INTO candidates (name, email, city, experience_years)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [newCandidate.name, newCandidate.email, newCandidate.city, newCandidate.experience_years],
    );
    return toCandidate(result.rows[0]);
  };

  update = async (id: number, data: NewCandidate): Promise<Candidate | undefined> => {
    const result = await this.pool.query<CandidateRow>(
      `UPDATE candidates
       SET name = $1, email = $2, city = $3, experience_years = $4
       WHERE id = $5
       RETURNING ${COLUMNS}`,
      [data.name, data.email, data.city, data.experience_years, id],
    );
    return result.rows[0] ? toCandidate(result.rows[0]) : undefined;
  };

  remove = async (id: number): Promise<boolean> => {
    const result = await this.pool.query('DELETE FROM candidates WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  };
}
