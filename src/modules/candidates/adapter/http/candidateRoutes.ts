import { Router } from 'express';
import { DomainError } from '../../../../shared/DomainError';
import HTTP_STATUS from '../../../../shared/httpStatus';
import { CandidateService } from '../../application/CandidateService';

const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError('El identificador no es válido');
  }
  return id;
};

export const createCandidateRouter = (service: CandidateService): Router => {
  const router = Router();

  router.get('/', async (req, res) => {
    const candidates = await service.list();
    res.status(HTTP_STATUS.OK).json(candidates);
  });

  router.get('/:id', async (req, res) => {
    const candidate = await service.getById(parseId(req.params.id));
    res.status(HTTP_STATUS.OK).json(candidate);
  });

  router.post('/', async (req, res) => {
    const candidate = await service.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(candidate);
  });

  router.put('/:id', async (req, res) => {
    const candidate = await service.update(parseId(req.params.id), req.body);
    res.status(HTTP_STATUS.OK).json(candidate);
  });

  router.delete('/:id', async (req, res) => {
    await service.remove(parseId(req.params.id));
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  return router;
};
