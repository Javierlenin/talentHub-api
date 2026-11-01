import 'dotenv/config';

import { Pool } from 'pg';

import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresCandidateRepository } from './PostgresCandidateRepository';

const sampleCandidate = { name: 'Ana Ruiz', email: 'ana@example.com', city: 'Quito', experience_years: 3 };
const connectionString = process.env.TEST_DATABASE_URL;
const describeWithDatabase = connectionString ? describe : describe.skip;

describeWithDatabase('PostgresCandidateRepository', () => {
  let pool: Pool;
  let repository: PostgresCandidateRepository;

  beforeAll(() => {
    pool = createPostgresPool(connectionString as string);
    repository = new PostgresCandidateRepository(pool);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE candidates RESTART IDENTITY');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a candidate and assigns an id', async () => {
    const saved = await repository.save(sampleCandidate);

    expect(saved).toEqual({ id: 1, ...sampleCandidate });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    await repository.save(sampleCandidate);
    const second = await repository.save({ ...sampleCandidate, email: 'otro@example.com' });

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a candidate by id and returns undefined when it does not exist', async () => {
    const saved = await repository.save(sampleCandidate);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('updates an existing candidate and keeps its id', async () => {
    const saved = await repository.save(sampleCandidate);

    const updated = await repository.update(saved.id, { ...sampleCandidate, experience_years: 5 });

    expect(updated).toEqual({ id: saved.id, ...sampleCandidate, experience_years: 5 });
    expect(await repository.update(999, sampleCandidate)).toBeUndefined();
  });

  it('removes a candidate and reports whether it existed', async () => {
    const saved = await repository.save(sampleCandidate);

    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.findAll()).toEqual([]);
    expect(await repository.remove(saved.id)).toBe(false);
  });
});
