import { NotFoundError } from '../../../shared/NotFoundError';
import { Candidate, parseNewCandidate } from '../domain/Candidate';
import { CandidateRepository } from '../ports/CandidateRepository';

const CANDIDATE_NOT_FOUND_MESSAGE = 'Candidato no encontrado';

export class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  list = async (): Promise<Candidate[]> => this.repository.findAll();

  getById = async (id: number): Promise<Candidate> => {
    const candidate = await this.repository.findById(id);
    if (!candidate) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
    return candidate;
  };

  create = async (input: unknown): Promise<Candidate> => {
    const newCandidate = parseNewCandidate(input);
    return this.repository.save(newCandidate);
  };

  update = async (id: number, input: unknown): Promise<Candidate> => {
    const data = parseNewCandidate(input);
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
    return updated;
  };

  remove = async (id: number): Promise<void> => {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
  };
}
