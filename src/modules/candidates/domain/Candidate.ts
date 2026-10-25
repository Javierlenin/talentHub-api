import { DomainError } from '../../../shared/DomainError';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  city: string;
  experienceYears: number;
}

export type NewCandidate = Omit<Candidate, 'id'>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseNewCandidate = (input: unknown): NewCandidate => {
  const { name, email, city, experienceYears } = (input ?? {}) as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
    throw new DomainError('El nombre y el correo son obligatorios');
  }

  const trimmedEmail = email.trim();
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  if (typeof city !== 'string' || !city.trim()) {
    throw new DomainError('La ciudad es obligatoria');
  }

  if (typeof experienceYears !== 'number' || experienceYears < 0) {
    throw new DomainError('Los años de experiencia deben ser un número igual o mayor que 0');
  }

  return {
    name: name.trim(),
    email: trimmedEmail,
    city: city.trim(),
    experienceYears,
  };
};
