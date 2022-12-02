import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  // addDummyDbItems,
  // addDbItem,
  // getAllDbItems,
  // getDbItemById,
  // DbItem,
  // updateDbItemById,
  updateQuizCompletionTracker,
  QuizCompletionTracker,
  updateQuizDataByNC,
  db

} from "./db";
import filePath from "./filePath";


const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4002;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

app.get("/quiz-completions", (req, res) => {
  res.status(200).json(QuizCompletionTracker);
});

app.post("/update-quiz-completions", (req, res) => {
  const currentQuizMode = req.body.mode;

  if (currentQuizMode) {
  updateQuizCompletionTracker(currentQuizMode);
  res.status(200).json(QuizCompletionTracker)
  } else {
    res.status(401).send('No body sent!')
  }
  
});

app.post<{nc:string}>("/update-quiz-country-data/:nc", (req, res) => {
  const numericCode = req.params.nc;
  const quizMode = req.body.mode;
  const answerType = req.body.answerType;

  if (req.body) {
    updateQuizDataByNC(numericCode, quizMode, answerType);
    res.status(200).json(db)
  } else {
    res.status(401).send("All NOT good")
  }
  
})

// // GET /items
// app.get("/items", (req, res) => {
//   const allSignatures = getAllDbItems();
//   res.status(200).json(allSignatures);
// });

// // POST /items
// app.post<{}, {}, DbItem>("/items", (req, res) => {
//   // to be rigorous, ought to handle non-conforming request bodies
//   // ... but omitting this as a simplification
//   const postData = req.body;
//   const createdSignature = addDbItem(postData);
//   res.status(201).json(createdSignature);
// });

// // GET /items/:id
// app.get<{ id: string }>("/items/:id", (req, res) => {
//   const matchingSignature = getDbItemById(parseInt(req.params.id));
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

// // DELETE /items/:id
// app.delete<{ id: string }>("/items/:id", (req, res) => {
//   const matchingSignature = getDbItemById(parseInt(req.params.id));
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

// // PATCH /items/:id
// app.patch<{ id: string }, {}, Partial<DbItem>>("/items/:id", (req, res) => {
//   const matchingSignature = updateDbItemById(parseInt(req.params.id), req.body);
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
