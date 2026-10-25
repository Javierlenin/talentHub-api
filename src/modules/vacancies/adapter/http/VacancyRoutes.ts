import { Router } from "express";
import { VacancyService } from "../../application/VacancyService";
import HTTP_STATUS from "../../../../shared/httpStatus";

export const createVacancyRoutes = (service: VacancyService): Router => {
    const router = Router();
  //GET LISTAR VACANTES
    router.get('/', async (req, res) => {
        const vacancies = await service.list();
        res.status(HTTP_STATUS.OK).json(vacancies);
    });

    //post crear una vacante
    router.post('/', async (req, res) => {
        const vacancy = await service.create(req.body);
        res.status(HTTP_STATUS.CREATED).json(vacancy);
    });
    return router;
};
