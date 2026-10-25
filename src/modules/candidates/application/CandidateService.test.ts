import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryCandidateRepository } from '../adapter/persistence/InMemoryCandidateRepository';
import { CandidateService } from './CandidateService';

const validInput = { name: 'Ana Ruiz', email: 'ana@example.com', city: 'Quito', experienceYears: 3 };

const createService = (): CandidateService => new CandidateService(new InMemoryCandidateRepository());

describe('CandidateService', () => {
  it('creates a valid candidate and returns it with an id', async () => {
    const service = createService();

    const created = await service.create(validInput);

    expect(created).toEqual({ id: 1, ...validInput });
  });

  it('rejects an invalid candidate and does not save it', async () => {
    const service = createService();

    await expect(service.create({ email: 'ana@example.com' })).rejects.toThrow(DomainError);
    expect(await service.list()).toEqual([]);
  });

  it('lists the candidates that were created', async () => {
    const service = createService();

    await service.create(validInput);

    expect(await service.list()).toHaveLength(1);
  });

  it('gets a candidate by id and throws NotFoundError when it does not exist', async () => {
    const service = createService();
    const created = await service.create(validInput);

    expect(await service.getById(created.id)).toEqual(created);
    await expect(service.getById(999)).rejects.toThrow(NotFoundError);
  });

  it('updates a candidate with valid data', async () => {
    const service = createService();
    const created = await service.create(validInput);

    const updated = await service.update(created.id, { ...validInput, experienceYears: 5 });

    expect(updated).toEqual({ id: created.id, ...validInput, experienceYears: 5 });
  });

  it('rejects an update with invalid data and throws NotFoundError for a missing id', async () => {
    const service = createService();
    const created = await service.create(validInput);

    await expect(service.update(created.id, { ...validInput, city: '' })).rejects.toThrow(DomainError);
    await expect(service.update(999, validInput)).rejects.toThrow(NotFoundError);
  });

  it('removes a candidate and throws NotFoundError when it does not exist', async () => {
    const service = createService();
    const created = await service.create(validInput);

    await service.remove(created.id);

    expect(await service.list()).toEqual([]);
    await expect(service.remove(created.id)).rejects.toThrow(NotFoundError);
  });
});
