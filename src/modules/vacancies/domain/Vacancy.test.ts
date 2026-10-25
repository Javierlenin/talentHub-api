import {DomainError} from "../../../shared/DomainError";
import {parseNewVacancy} from "./Vacancy";

describe('parseNewVacancy', () => {
    it('returns the vacancy object with trimmed ', () => {
        const input = { title: 'QA Tester', company: 'Tech Andes', modality: 'presencial', salary: 800 };
        const result = parseNewVacancy(input);
        expect(result).toEqual(input);
    });
    it('throws when  required field is missing', () => {
        const input = { company: 'Tech Andes' };
        expect(() => parseNewVacancy(input)).toThrow(DomainError);
    });
    it('throws when  salary is not a positive number', () => {
        const input = { title: 'QA Tester', company: 'Tech Andes', modality: 'presencial', salary: 0 };
        expect(() => parseNewVacancy(input)).toThrow(DomainError);
    });
});