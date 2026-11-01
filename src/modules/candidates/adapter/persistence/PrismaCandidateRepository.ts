import { PrismaClient } from '../../../../generated/prisma/client';
import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

type CandidateRecord = {
  id: number;
  name: string;
  email: string;
  city: string;
  experience_years: number;
};

const toCandidate = (record: CandidateRecord): Candidate => ({
  id: record.id,
  name: record.name,
  email: record.email,
  city: record.city,
  experience_years: record.experience_years,
});

// Adaptador de salida: cumple CandidateRepository usando Prisma.
const isRecordNotFound = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2025';

export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAll = async (): Promise<Candidate[]> => {
    const records = await this.prisma.candidate.findMany({
      orderBy: { id: 'asc' },
    });
    return records.map(toCandidate);
  };
  
  findById = async (id: number): Promise<Candidate | undefined> => {
    const record = await this.prisma.candidate.findUnique({ where: { id } });
    return record ? toCandidate(record) : undefined;
  };

  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const record = await this.prisma.candidate.create({ data: newCandidate });
    return toCandidate(record);
  };

  update = async (id: number, data: NewCandidate): Promise<Candidate | undefined> => {
    try {
      const record = await this.prisma.candidate.update({ where: { id }, data });
      return toCandidate(record);
    } catch (error) {
      if (isRecordNotFound(error)) {
        return undefined;
      }
      throw error;
    }  
  };

  remove = async (id: number): Promise<boolean> => {
    try {
      await this.prisma.candidate.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFound(error)) {
        return false;
      }
      throw error;
    }
  };
}