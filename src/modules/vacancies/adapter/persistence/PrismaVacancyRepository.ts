import { PrismaClient } from '../../../../generated/prisma/client';
import { NewVacancy, Vacancy } from '../../domain/Vacancy';
import { VacancyRepository } from '../../ports/VacancyRepository';

type VacancyRecord = {
  id: number;
  title: string;
  company: string;
  modality: string;
  salary: { toNumber: () => number };
};

const toVacancy = (record: VacancyRecord): Vacancy => ({
  id: record.id,
  title: record.title,
  company: record.company,
  modality: record.modality,
  salary: record.salary.toNumber(),
});

const isRecordNotFound = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2025';

export class PrismaVacancyRepository implements VacancyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAll = async (): Promise<Vacancy[]> => {
    const records = await this.prisma.vacancy.findMany({
      orderBy: { id: 'asc' },
    });
    return records.map(toVacancy);
  };

  findById = async (id: number): Promise<Vacancy | undefined> => {
    const record = await this.prisma.vacancy.findUnique({ where: { id } });
    return record ? toVacancy(record) : undefined;
  };

  save = async (newVacancy: NewVacancy): Promise<Vacancy> => {
    const record = await this.prisma.vacancy.create({ data: newVacancy });
    return toVacancy(record);
  };

  update = async (id: number, data: NewVacancy): Promise<Vacancy | undefined> => {
    try {
      const record = await this.prisma.vacancy.update({ where: { id }, data });
      return toVacancy(record);
    } catch (error) {
      if (isRecordNotFound(error)) {
        return undefined;
      }
      throw error;
    }
  };

  remove = async (id: number): Promise<boolean> => {
    try {
      await this.prisma.vacancy.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFound(error)) {
        return false;
      }
      throw error;
    }
  };
}
