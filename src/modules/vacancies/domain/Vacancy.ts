import { DomainError } from "../../../shared/DomainError";

// interface definir la estrcutur ade los objetos vacantes
export interface Vacancy {
    id: number;
    title: string;
    company: string;
    modality: string;
    salary: number;
}
// Una nueva vacnte :Datos que se espera recibir desde el cliente

export type NewVacancy = Omit<Vacancy, 'id'>;

export const parseNewVacancy = ( input : unknown ) : NewVacancy =>{
    const { title, company, modality, salary } = (input ?? {}) as Record<string, unknown>;
    
    // Regla 1 
    if (typeof title !== 'string' || !title.trim() ||
        typeof company !== 'string' || !company.trim() ||
        typeof modality !== 'string' || !modality.trim()) {
        throw new DomainError('El título, la empresa y la modalidad son obligatorios');
    }
    // Regla 2
    if (typeof salary !== 'number' || salary <= 0) {
        throw new DomainError('El salario debe ser un número mayor que 0');
    }
    // Si todo está bien, devolvemos el objeto con los datos de la nueva vacante
    return { title : title.trim(), company : company.trim(), modality : modality.trim(), salary };
}