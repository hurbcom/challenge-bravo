import { Request, Response } from "express";


const currecyListController =async (req: Request, res: Response) => {
  const query = req.query;
  
  return res.status(200).send({"message": ""})
}

export default currecyListController;