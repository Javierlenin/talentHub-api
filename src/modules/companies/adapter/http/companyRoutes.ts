import { Router } from 'express';
import HTTP_STATUS from '../../../../shared/httpStatus';
import { CompanyService } from '../../application/CompanyService';

export const createCompanyRouter = (service: CompanyService): Router => {
  const router = Router();

  router.get('/', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list());
  });

  router.get('/:id', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.getById(req.params.id));
  });

  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  return router;
};
