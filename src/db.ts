export interface QuizCountryData {
  numericCode: string;
  flags: quizDataForCountry;
  capitals: quizDataForCountry;
  population: quizDataForCountry;
}

interface quizDataForCountry {
  correct: number;
  incorrect: number;
}

interface IQuizCompletionTracker {
  flags: number;
  capitals: number;
  population: number;
}
type QuizMode = "flags" | "capitals" | "population";
type AnswerType = "correct" | "incorrect";

/** Array of QuizCountryData objects. Each object is updated when a user answers a quiz question on that specific country*/
export const db: QuizCountryData[] = [];

/** Variable to keep incrementing id of database items */
let idCounter = 0;

/** Object to keep count of how many times you've completed a quiz and in what mode */
export const QuizCompletionTracker: IQuizCompletionTracker = {
  flags: 0,
  capitals: 0,
  population: 0,
};

export const updateQuizCompletionTracker = (currentQuizMode: QuizMode) => {
  QuizCompletionTracker[currentQuizMode]++;
};

/**
 * Updates the data of a particular country's quiz data based on the answer type ((in)correct) and the quiz mode. 
 * @param numericCode code by which the country is identified
 * @param quizMode the quiz mode in which the answer was recorded
 * @param answerType stores the type of answer out of correct / incorrect
 */
export const updateQuizDataByNC = (
  numericCode: string,
  quizMode: QuizMode,
  answerType: AnswerType
) => {
  const potentialIdx: number | "not found" = findIndexOfDbItemByNC(numericCode);
  if (potentialIdx !== "not found") {
    db[potentialIdx][quizMode][answerType]++;
  } else {
    db.push({
      numericCode: numericCode,
      flags: { correct: 0, incorrect: 0 },
      capitals: { correct: 0, incorrect: 0 },
      population: { correct: 0, incorrect: 0 },
    });
    db[db.length-1][quizMode][answerType]++;
  }
};

/**
 * Locates a database item by a given numericCode
 *
 * @param numericCode - the numericCode of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getDbItemByNC = (
  numericCode: string
): QuizCountryData | "not found" => {
  const maybeEntry = db.find((entry) => entry.numericCode === numericCode);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given numericCode
 *
 * @param id - the numericCode of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfDbItemByNC = (numericCode: string): number | "not found" => {
  const matchingIdx = db.findIndex(
    (entry) => entry.numericCode === numericCode
  );
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

// /**
//  * Adds in a single item to the database
//  *
//  * @param data - the item data to insert in
//  * @returns the item added (with a newly created id)
//  */
// export const addDbItem = (data: CountryData): DbItemWithId => {
//   const newEntry: DbItemWithId = {
//     id: ++idCounter,
//     ...data,
//   };
//   db.push(newEntry);
//   return newEntry;
// };

// /**
//  * Deletes a database item with the given id
//  *
//  * @param id - the id of the database item to delete
//  * @returns the deleted database item (if originally located),
//  *  otherwise the string `"not found"`
//  */
// export const deleteDbItemById = (id: number): DbItemWithId | "not found" => {
//   const idxToDeleteAt = findIndexOfDbItemById(id);
//   if (typeof idxToDeleteAt === "number") {
//     const itemToDelete = getDbItemById(id);
//     db.splice(idxToDeleteAt, 1); // .splice can delete from an array
//     return itemToDelete;
//   } else {
//     return "not found";
//   }
// };

// /**
//  * Finds the index of a database item with a given id
//  *
//  * @param id - the id of the database item to locate the index of
//  * @returns the index of the matching database item,
//  *  otherwise the string `"not found"`
//  */
// const findIndexOfDbItemById = (id: number): number | "not found" => {
//   const matchingIdx = db.findIndex((entry) => entry.id === id);
//   // .findIndex returns -1 if not located
//   if (matchingIdx !== -1) {
//     return matchingIdx;
//   } else {
//     return "not found";
//   }
// };

// /**
//  * Find all database items
//  * @returns all database items from the database
//  */
// export const getAllDbItems = (): DbItemWithId[] => {
//   return db;
// };

// /**
//  * Applies a partial update to a database item for a given id
//  *  based on the passed data
//  *
//  * @param id - the id of the database item to update
//  * @param newData - the new data to overwrite
//  * @returns the updated database item (if one is located),
//  *  otherwise the string `"not found"`
//  */
// export const updateDbItemById = (
//   id: number,
//   newData: Partial<CountryData>
// ): DbItemWithId | "not found" => {
//   const idxOfEntry = findIndexOfDbItemById(id);
//   // type guard against "not found"
//   if (typeof idxOfEntry === "number") {
//     return Object.assign(db[idxOfEntry], newData);
//   } else {
//     return "not found";
//   }
// };
