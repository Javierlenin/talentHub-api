import { Company, NewCompany } from '../../domain/Company';
import { CompanyRepository } from '../../ports/CompanyRepository';

export class InMemoryCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];
  private nextId = 1;

  findAll = async (): Promise<Company[]> => structuredClone(this.companies);

  findById = async (id: string): Promise<Company | undefined> => {
    const company = this.companies.find((item) => item.id === id);
    return company ? structuredClone(company) : undefined;
  };

  save = async (newCompany: NewCompany): Promise<Company> => {
    const company: Company = { id: String(this.nextId++), ...newCompany };
    this.companies.push(structuredClone(company));
    return company;
  };
}
