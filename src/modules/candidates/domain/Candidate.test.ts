import { DomainError } from '../../../shared/DomainError';
import { parseNewCandidate } from './Candidate';

const validInput = { name: 'Ana Ruiz', email: 'ana@example.com', city: 'Quito', experienceYears: 3 };

describe('parseNewCandidate', () => {
  it('returns the candidate with trimmed text', () => {
    const result = parseNewCandidate({
      name: '  Ana Ruiz  ',
      email: '  ana@example.com  ',
      city: '  Quito  ',
      experienceYears: 3,
    });

    expect(result).toEqual(validInput);
  });

  it('throws when name or email is missing', () => {
    expect(() => parseNewCandidate({ email: 'ana@example.com', city: 'Quito', experienceYears: 3 })).toThrow(
      new DomainError('El nombre y el correo son obligatorios'),
    );
  });

  it('throws when the email format is invalid', () => {
    expect(() => parseNewCandidate({ ...validInput, email: 'ana-example.com' })).toThrow(
      new DomainError('El correo no tiene un formato válido'),
    );
  });

  it('throws when city is missing', () => {
    expect(() => parseNewCandidate({ name: 'Ana Ruiz', email: 'ana@example.com', experienceYears: 3 })).toThrow(
      new DomainError('La ciudad es obligatoria'),
    );
  });

  it('throws when experience years is not a number greater than or equal to zero', () => {
    expect(() => parseNewCandidate({ ...validInput, experienceYears: -1 })).toThrow(
      new DomainError('Los años de experiencia deben ser un número igual o mayor que 0'),
    );
    expect(parseNewCandidate({ ...validInput, experienceYears: 0 }).experienceYears).toBe(0);
  });
});
