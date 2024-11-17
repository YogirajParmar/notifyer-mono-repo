import { TRequest, TResponse } from "../../types";
import { PUC, User } from "../../entities";
import { CreatePUCDto } from "./dto";
import { Op } from "sequelize";

export class DocumentController {
  constructor() {}

  public addDocument = async (req: TRequest<CreatePUCDto>, res: TResponse) => {
    try {
      const user = req.me;
      const { vehicleNumber, vehicleType, issueDate, expirationDate, documentType } = req.dto;
      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
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

      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDocuments = await PUC.findAll({ where: { userId: user.id } });
      if (!userDocuments.length) {
        return res.status(404).json({ error: "No documents found" });
      }

      return res.json(userDocuments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  public deleteDocument = async (req: TRequest, res: TResponse) => {
    try {
      const user = req.me;
      const { id } = req.params;

      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const findExistingDocument = await PUC.findByPk(id);

      if (!findExistingDocument) {
        return res.status(404).json({ error: "Document not found" });
      }

      await findExistingDocument.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  public getDocumentStats = async (req: TRequest, res: TResponse) => {
    try {
      const user = req.me;
      const { id } = req.params;

      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const totalDocuments = await PUC.count({ where: { userId: user.id } });

      const today = new Date();
      const expieredDocs = await PUC.count({
        where: {
          userId: user.id,
          expirationDate: {
            [Op.lt]: today
          }
        }
      });

      res.json({
        totalDocuments,
        expieredDocs
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  };

  public updateDocument = async (req: TRequest<CreatePUCDto>, res: TResponse) => {
    try {
      const user = req.me;
      const { id } = req.params;
      const { vehicleNumber, vehicleType, issueDate, expirationDate, documentType } = req.dto;
      const findExistingUser = await User.findByPk(user.id);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const findExistingDocument = await PUC.findByPk(id);

      if (!findExistingDocument) {
        return res.status(404).json({ error: "Document not found" });
      }

      const updateDocument = await findExistingDocument.update({
        vehicleNumber: vehicleNumber,
        vehicleType: vehicleType,
        issueDate: new Date(issueDate),
        expirationDate: new Date(expirationDate) || null,
        documentType: documentType,
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
      const findExistingUser = await User.findByPk(userId);

      if (!findExistingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const document = await PUC.findOne({where: {id: id, userId: userId}});

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      return res.json(document);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}