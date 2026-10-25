import { NewVacancy, Vacancy,parseNewVacancy } from "../domain/Vacancy";
import { VacancyRepository } from "../ports/VacancyRepository";

export class VacancyService {
    constructor(private readonly repository: VacancyRepository) {}

    // caso 1 listar vacantes
    list = async (): Promise<Vacancy[]> => this.repository.findAll();
    

    // caso 2 crear vacante
    create = async (input : unknown): Promise<Vacancy> => {
        const newVacancy = parseNewVacancy(input);
        return this.repository.save(newVacancy);
    }
}