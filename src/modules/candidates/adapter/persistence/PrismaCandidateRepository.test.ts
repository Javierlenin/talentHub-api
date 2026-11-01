import 'dotenv/config';

import { PrismaClient } from '../../../../generated/prisma/client';
import { createPrismaClient } from '../../../../shared/database/prismaClient';
import { PrismaCandidateRepository } from './PrismaCandidateRepository';

if (!process.env.TEST_DATABASE_URL || process.env.TEST_DATABASE_URL === process.env.DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL debe existir y ser distinta de DATABASE_URL');
}

const sampleCandidate = { name: 'John Doe', email: 'john.doe@example.com', city: 'New York', experience_years: 5 };

describe('PrismaCandidateRepository', () => {
  let prisma: PrismaClient;
  let repository: PrismaCandidateRepository;

  beforeAll(() => {
    prisma = createPrismaClient(process.env.TEST_DATABASE_URL as string);
    repository = new PrismaCandidateRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE candidates RESTART IDENTITY');
  });

  afterAll(async () => {
    await prisma.$disconnect();
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
    const second = await repository.save(sampleCandidate);

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

    const updated = await repository.update(saved.id, { ...sampleCandidate, experience_years: 10 });

    expect(updated).toEqual({ id: saved.id, ...sampleCandidate, experience_years: 10 });
    expect(await repository.update(999, sampleCandidate)).toBeUndefined();
  });

  it('removes a candidate and reports whether it existed', async () => {
    const saved = await repository.save(sampleCandidate);

    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.findAll()).toEqual([]);
    expect(await repository.remove(saved.id)).toBe(false);
  });
});
