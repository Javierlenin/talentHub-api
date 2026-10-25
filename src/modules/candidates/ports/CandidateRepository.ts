import { Candidate, NewCandidate } from '../domain/Candidate';

export interface CandidateRepository {
  findAll: () => Promise<Candidate[]>;
  findById: (id: number) => Promise<Candidate | undefined>;
  save: (newCandidate: NewCandidate) => Promise<Candidate>;
  update: (id: number, data: NewCandidate) => Promise<Candidate | undefined>;
  remove: (id: number) => Promise<boolean>;
}
