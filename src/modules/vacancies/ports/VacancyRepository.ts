import { NewVacancy ,Vacancy } from "../domain/Vacancy";

export interface VacancyRepository {
   findAll(): Promise<Vacancy[]>;
   save(vacancy: NewVacancy): Promise<Vacancy>;
 
    findById(id: number): Promise<Vacancy | null>;
}
