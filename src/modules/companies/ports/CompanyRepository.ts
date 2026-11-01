import { Company, NewCompany } from '../domain/Company';

export interface CompanyRepository {
  findAll: () => Promise<Company[]>;
  findById: (id: string) => Promise<Company | undefined>;
  save: (newCompany: NewCompany) => Promise<Company>;
}
