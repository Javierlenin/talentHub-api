import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

export class InMemoryCandidateRepository implements CandidateRepository {
  private candidates: Candidate[];
  private nextId: number;

  constructor(initialCandidates: Candidate[] = []) {
    this.candidates = [...initialCandidates];
    this.nextId = initialCandidates.length + 1;
  }

  findAll = async (): Promise<Candidate[]> => [...this.candidates];

  findById = async (id: number): Promise<Candidate | undefined> => {
    const candidate = this.candidates.find((item) => item.id === id);
    return candidate ? { ...candidate } : undefined;
  };

  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const candidate: Candidate = { id: this.nextId++, ...newCandidate };
    this.candidates.push(candidate);
    return candidate;
  };

  update = async (id: number, data: NewCandidate): Promise<Candidate | undefined> => {
    const index = this.candidates.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    const updated: Candidate = { id, ...data };
    this.candidates[index] = updated;
    return { ...updated };
  };

  remove = async (id: number): Promise<boolean> => {
    const index = this.candidates.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.candidates.splice(index, 1);
    return true;
  };
}
