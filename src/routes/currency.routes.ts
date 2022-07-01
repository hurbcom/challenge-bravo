import { Router } from "express";
import currecyListController from "../controllers/currency/currencyList.controller";

const routes = Router();

export function currencyRoutes() {
  routes.get("", currecyListController);
  return routes;
};

