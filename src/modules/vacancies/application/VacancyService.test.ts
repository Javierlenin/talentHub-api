import { InMemoryVacancyRepository } from "../adapter/persistence/InMemoryVacancyRepository";
import { VacancyService } from "./VacancyService";
import { DomainError } from "../../../shared/DomainError";

const validInput = {
    title: 'Software Engineer',
    company: 'Google',
    modality: 'Remote',
    salary: 100000,
}
describe('VacancyService', () => {
    it('creates a valid vacancy', async () => {
        const service = new VacancyService(new InMemoryVacancyRepository());
        const create = await service.create(validInput);
        expect(create).toEqual({id: 1, ...validInput});
    });
    it('rejects an invalid vacancy and does not save it', async () => {
        const service = new VacancyService(new InMemoryVacancyRepository());
        await expect(service.create({ company: 'Tech Company' })).rejects.toThrow(DomainError);

        expect(await service.list()).toEqual([]);
    });

    it('lists the cacancies that were created', async () => {
        const service = new VacancyService(new InMemoryVacancyRepository());
        await service.create(validInput);
        expect(await service.list()).toHaveLength(1) ;
    });
});