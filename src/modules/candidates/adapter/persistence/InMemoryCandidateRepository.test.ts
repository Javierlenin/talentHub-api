import { InMemoryCandidateRepository } from './InMemoryCandidateRepository';

const sampleCandidate = { name: 'Ana Ruiz', email: 'ana@example.com', city: 'Quito', experienceYears: 3 };

describe('InMemoryCandidateRepository', () => {
  it('starts empty when no initial candidates are given', async () => {
    const repository = new InMemoryCandidateRepository();

    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a candidate and assigns an id', async () => {
    const repository = new InMemoryCandidateRepository();

    const saved = await repository.save(sampleCandidate);

    expect(saved).toEqual({ id: 1, ...sampleCandidate });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    const repository = new InMemoryCandidateRepository();

    await repository.save(sampleCandidate);
    const second = await repository.save(sampleCandidate);

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a candidate by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('updates an existing candidate and keeps its id', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    const updated = await repository.update(saved.id, { ...sampleCandidate, experienceYears: 5 });

    expect(updated).toEqual({ id: saved.id, ...sampleCandidate, experienceYears: 5 });
    expect(await repository.update(999, sampleCandidate)).toBeUndefined();
  });

  it('removes a candidate and reports whether it existed', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.findAll()).toEqual([]);
    expect(await repository.remove(saved.id)).toBe(false);
  });
});
