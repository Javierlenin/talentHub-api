import { NotFoundError } from '../../../shared/NotFoundError';
import { Company, parseNewCompany } from '../domain/Company';
import { CompanyRepository } from '../ports/CompanyRepository';

const COMPANY_NOT_FOUND_MESSAGE = 'Empresa no encontrada';

export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  list = async (): Promise<Company[]> => this.repository.findAll();

  getById = async (id: string): Promise<Company> => {
    const company = await this.repository.findById(id);
    if (!company) {
      throw new NotFoundError(COMPANY_NOT_FOUND_MESSAGE);
    }
    return company;
  };

  create = async (input: unknown): Promise<Company> => this.repository.save(parseNewCompany(input));
}
