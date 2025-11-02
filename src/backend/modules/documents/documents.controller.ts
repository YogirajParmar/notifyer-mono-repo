import { TRequest, TResponse } from '../../types';
import { PUC, User } from '../../entities';
import { CreatePUCDto } from './dto';
import { Op } from 'sequelize';
import { logger } from '../../helpers';

export class DocumentController {
  constructor() {}

  public addDocument = async (req: TRequest<CreatePUCDto>, res: TResponse) => {
    try {
      const user = req.me;
      const {
        vehicleNumber,
        vehicleType,
        issueDate,
        expirationDate,
        documentType,
      } = req.dto;
      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newDocument = await PUC.create({
        vehicleNumber: vehicleNumber,
        vehicleType: vehicleType,
        issueDate: new Date(issueDate),
        expirationDate: new Date(expirationDate) || null,
        userId: user.id,
        documentType: documentType,
      });

      return res.json(newDocument);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  public getDocuments = async (req: TRequest, res: TResponse) => {
    try {
      const user = req.me;

      const userDocuments = await PUC.findAll({
        where: { userId: user.id, deleted: false },
      });
      if (!userDocuments) {
        return res.status(404).json({ error: 'No documents found' });
      }

      return res.json(userDocuments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  public deleteDocument = async (req: TRequest, res: TResponse) => {
    try {
      const { id } = req.params;

      const document = await PUC.findByPk(id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // soft delete document
      await document.update({ deleted: true, deletedAt: new Date() });
      // await findExistingDocument.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  public getDocumentStats = async (req: TRequest, res: TResponse) => {
    try {
      const user = req.me;
      const { id } = req.params;

      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const totalDocuments = await PUC.count({
        where: { userId: user.id, deleted: false },
      });

      const today = new Date();
      const expieredDocs = await PUC.count({
        where: {
          userId: user.id,
          expirationDate: {
            [Op.lt]: today,
          },
          deleted: false,
        },
      });

      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Start of current month
      const currentMonthStart = new Date(currentYear, currentMonth, 1);

      // End of current month
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

      const expiringThisMonth = await PUC.count({
        where: {
          userId: user.id,
          expirationDate: {
            [Op.between]: [currentMonthStart, currentMonthEnd],
          },
          deleted: false,
        },
      });

      res.json({
        totalDocuments,
        expieredDocs,
        expiringThisMonth,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  };

  public updateDocument = async (
    req: TRequest<CreatePUCDto>,
    res: TResponse
  ) => {
    try {
      const user = req.me;
      const { id } = req.params;
      const {
        vehicleNumber,
        vehicleType,
        issueDate,
        expirationDate,
        documentType,
      } = req.dto;

      const document = await PUC.findOne({
        where: { id, deleted: false },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      await document.update({
        ...req.dto,
        issueDate: new Date(issueDate),
        expirationDate: new Date(expirationDate),
      });

      return res.status(200).json(true);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  };

  public getDocument = async (req: TRequest, res: TResponse) => {
    const { id } = req.params;
    const userId = req.me.id;

    try {
      const document = await PUC.findOne({
        where: { id: id, userId: userId, deleted: false },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.json(document);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  public searchDocuments = async (req: TRequest, res: TResponse) => {
    try {
      const userId = req.me.id;
      const query = ((req.query.query as string) || '').trim().toLowerCase();

      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const documents = await PUC.findAll({
        where: {
          userId,
          [Op.or]: [
            { documentType: { [Op.like]: `%${query}%` } },
            { vehicleNumber: { [Op.like]: `%${query}%` } },
            { vehicleType: { [Op.like]: `%${query}%` } },
          ],
          deleted: false,
        },
        order: [['createdAt', 'DESC']],
      });

      res.json(documents);
    } catch (err) {
      console.error('Error searching documents:', err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
}
