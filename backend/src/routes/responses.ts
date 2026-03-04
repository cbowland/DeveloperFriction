import { Router, Request, Response } from "express";
import { addResponse, getResults } from "../store";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { q1, q2, q3 } = req.body;

  for (const val of [q1, q2, q3]) {
    if (typeof val !== "number" || ![1, 2, 3].includes(val)) {
      res.status(400).json({ error: "Each answer must be 1, 2, or 3" });
      return;
    }
  }

  const entry = addResponse({ q1, q2, q3 });
  res.status(201).json(entry);
});

router.get("/results", (_req: Request, res: Response) => {
  res.json(getResults());
});

export default router;
