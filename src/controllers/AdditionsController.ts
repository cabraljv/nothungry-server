import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Additions from '../models/Additions';

class AdditionsControllers {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      description: Yup.string().min(5).required(),
      price: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const additionsRepo = getRepository(Additions);

    const addition = additionsRepo.create({
      restaurant: req.userId,
      description: req.body.description,
      price: req.body.price,
    });

    await additionsRepo.save(addition);

    return res.json({ response: 'Addition successfull created' });
  }

  async index(req: Request, res: Response) {
    const additionsRepo = getRepository(Additions);
    const additions = await additionsRepo.find({
      restaurant: req.userId,
    });

    return res.json(additions);
  }
}

export default new AdditionsControllers();
