export type Question = {
  id: number;
  type: "mcq" | "practical";
  category: "html" | "css" | "javascript" | "react" | "node" | "firebase" | "php" | "cli" | "database";
  question: string;
  options?: string[];
  answer?: string; // For auto-grading MCQs
  exactMatches?: string[]; // Array of strings/regex that MUST exist in practical code
  isSubstitute?: boolean; // Flag for penalty questions
};

// Main pool of questions
export const mainQuestionPool: Question[] = [
  // --- MCQs ---
  { id: 1, type: "mcq", category: "javascript", question: "What is the output of `typeof null` in JavaScript?", options: ["null", "undefined", "object", "string"], answer: "object" },
  { id: 2, type: "mcq", category: "react", question: "Which hook should be used to access the DOM directly in React?", options: ["useEffect", "useState", "useRef", "useContext"], answer: "useRef" },
  { id: 3, type: "mcq", category: "node", question: "Which core Node.js module is used to create a web server?", options: ["http", "fs", "path", "url"], answer: "http" },
  { id: 4, type: "mcq", category: "database", question: "What does ACID stand for in database systems?", options: ["Atomicity, Consistency, Isolation, Durability", "Array, Caching, Indexing, Data", "Asynchronous, Concurrent, Isolated, Dynamic", "None of the above"], answer: "Atomicity, Consistency, Isolation, Durability" },
  { id: 5, type: "mcq", category: "firebase", question: "Which Firebase service is best for real-time document-based data synchronization?", options: ["Firebase Storage", "Firestore", "Firebase Hosting", "Firebase Authentication"], answer: "Firestore" },
  { id: 6, type: "mcq", category: "php", question: "Which superglobal variable in PHP holds data sent via the URL?", options: ["$_POST", "$_GET", "$_REQUEST", "$_SESSION"], answer: "$_GET" },
  { id: 7, type: "mcq", category: "cli", question: "Which command lists all hidden files in a Unix-based command prompt?", options: ["ls", "ls -a", "dir /h", "show -hidden"], answer: "ls -a" },
  { id: 8, type: "mcq", category: "html", question: "Which HTML tag is used to embed a responsive image that changes based on screen size?", options: ["<img>", "<picture>", "<svg>", "<canvas>"], answer: "<picture>" },
  { id: 9, type: "mcq", category: "css", question: "In CSS Grid, what property defines the size of columns?", options: ["grid-template-rows", "grid-column-gap", "grid-template-columns", "grid-auto-flow"], answer: "grid-template-columns" },
  { id: 10, type: "mcq", category: "javascript", question: "What does the `===` operator do in JavaScript?", options: ["Checks for value equality only", "Assigns a value", "Checks for both value and type equality", "Compares object references only"], answer: "Checks for both value and type equality" },

  // --- STRICT PRACTICALS ---
  // To get 100% perfect code match, we check if their code contains specific required keywords/syntax
  { 
    id: 101, type: "practical", category: "css", 
    question: "Write EXACTLY the CSS rule to make a div with class 'container' a Flexbox container that centers items horizontally and vertically.",
    exactMatches: ["display: flex;", "justify-content: center;", "align-items: center;"] 
  },
  { 
    id: 102, type: "practical", category: "javascript", 
    question: "Write an arrow function named 'add' that takes 'a' and 'b' and returns their sum.",
    exactMatches: ["const add", "=", "(a, b)", "=>", "a + b"] 
  },
  { 
    id: 103, type: "practical", category: "node", 
    question: "Write the exact line of code to require the 'fs' module in a CommonJS Node file and assign it to a const variable named 'fs'.",
    exactMatches: ["const fs = require('fs');"] 
  }
];

// Dedicated pool of hard questions for cheaters
export const penaltyQuestionPool: Question[] = [
  { id: 901, type: "mcq", category: "javascript", isSubstitute: true, question: "[PENALTY] What is the event loop's priority order between microtasks and macrotasks?", options: ["Macrotasks execute first", "Microtasks execute first, completely emptying their queue before the next macrotask", "They execute in parallel", "Random execution"], answer: "Microtasks execute first, completely emptying their queue before the next macrotask" },
  { id: 902, type: "practical", category: "react", isSubstitute: true, question: "[PENALTY] Write a strict React functional component named 'MemoButton' wrapped in React.memo.", exactMatches: ["const MemoButton", "React.memo(", "export default MemoButton"] },
  { id: 903, type: "mcq", category: "database", isSubstitute: true, question: "[PENALTY] What is a B-Tree index commonly used for?", options: ["Caching images", "Speeding up range queries and sorting in relational databases", "Storing JSON files", "Encrypting passwords"], answer: "Speeding up range queries and sorting in relational databases" },
  { id: 904, type: "practical", category: "php", isSubstitute: true, question: "[PENALTY] Write the exact PHP code to start a session securely.", exactMatches: ["session_start();"] },
];

// Helper to get random questions (You can expand this to pull 20 out of 100)
export const getRandomQuestions = (count: number) => {
  return [...mainQuestionPool].sort(() => 0.5 - Math.random()).slice(0, count);
};