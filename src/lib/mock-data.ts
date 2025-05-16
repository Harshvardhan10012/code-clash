import type { Challenge, User, Prediction, ProposedBet, TestCase } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Placeholder for generating unique IDs

// Helper to simulate UUID generation if not available or for consistency
const generateId = (): string => typeof uuidv4 === 'function' ? uuidv4() : `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;


export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Coder', avatarUrl: 'https://placehold.co/100x100.png', aiHintAvatar: 'woman portrait', score: 1250 },
  { id: 'user2', name: 'Bob Scripter', avatarUrl: 'https://placehold.co/100x100.png', aiHintAvatar: 'man portrait', score: 1100 },
  { id: 'user3', name: 'Charlie Dev', avatarUrl: 'https://placehold.co/100x100.png', aiHintAvatar: 'person coding', score: 950 },
  { id: 'user4', name: 'Diana Algorithm', avatarUrl: 'https://placehold.co/100x100.png', aiHintAvatar: 'woman tech', score: 1500 },
  { id: 'user5', name: 'Evan Syntax', avatarUrl: 'https://placehold.co/100x100.png', aiHintAvatar: 'man glasses', score: 800 },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() -2);


export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    language: 'JavaScript',
    difficulty: 'Easy',
    points: 100,
    deadline: tomorrow.toISOString(),
    status: 'open',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'abstract code',
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" }
    ],
    exampleSolution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};"
  },
  {
    id: 'challenge2',
    title: 'FizzBuzz Advanced',
    description: 'Write a program that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz". Additionally, for prime numbers, print "Prime".',
    language: 'Python',
    difficulty: 'Medium',
    points: 150,
    deadline: dayAfterTomorrow.toISOString(),
    status: 'open',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'network nodes',
  },
  {
    id: 'challenge3',
    title: 'Palindrome Checker',
    description: 'Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
    language: 'JavaScript',
    difficulty: 'Easy',
    points: 75,
    deadline: yesterday.toISOString(),
    status: 'completed',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'symmetry pattern',
    testCases: [
        { input: "s = \"A man, a plan, a canal: Panama\"", expectedOutput: "true"},
        { input: "s = \"race a car\"", expectedOutput: "false"}
    ],
    exampleSolution: "function isPalindrome(s) {\n const alphanumericOnly = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n return alphanumericOnly === alphanumericOnly.split('').reverse().join('');\n}"
  },
  {
    id: 'challenge4',
    title: 'Binary Search Tree Validator',
    description: 'Implement a function to check if a binary tree is a valid binary search tree (BST).',
    language: 'Python',
    difficulty: 'Hard',
    points: 250,
    deadline: twoDaysAgo.toISOString(),
    status: 'completed',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'tree structure',
  }
];

export let mockPredictions: Prediction[] = [ // Changed to let for modification
  {
    id: 'pred1',
    userId: 'user1', // Alice
    challengeId: 'challenge3',
    submittedCode: 'function isPalindrome(s) { /* ... Alice Coder implementation ... */ }',
    predictedOutcome: { willPass: true },
    actualOutcome: { willPass: true, reasoning: 'The solution correctly handles edge cases and standard inputs for palindrome checking.' },
    isCorrect: true,
    pointsEarned: 75,
    submissionDate: new Date(new Date(mockChallenges[2].deadline).getTime() - (1000 * 60 * 60 * 2)).toISOString() // 2 hours before deadline
  },
  {
    id: 'pred2',
    userId: 'user2', // Bob
    challengeId: 'challenge3',
    submittedCode: 'function isPalindrome(s) { /* ... Bob Scripter implementation ... */ }',
    predictedOutcome: { willPass: true },
    actualOutcome: { willPass: false, reasoning: 'The solution fails on strings with mixed casing and punctuation.' },
    isCorrect: false,
    pointsEarned: 0,
    submissionDate: new Date(new Date(mockChallenges[2].deadline).getTime() - (1000 * 60 * 60 * 1)).toISOString() // 1 hour before deadline
  },
  {
    id: 'pred3',
    userId: 'user4', // Diana
    challengeId: 'challenge4',
    submittedCode: 'class TreeNode:\n    # ... Diana Algorithm BST implementation ...',
    predictedOutcome: { willPass: true },
    actualOutcome: { willPass: true, reasoning: 'Solution correctly validates BST properties, including handling null nodes and ensuring left < root < right constraints throughout the tree.' },
    isCorrect: true,
    pointsEarned: 250,
    submissionDate: new Date(new Date(mockChallenges[3].deadline).getTime() - (1000 * 60 * 60 * 5)).toISOString()
  },
  {
    id: 'pred4',
    userId: 'user1', // Alice
    challengeId: 'challenge4',
    submittedCode: 'class TreeNode:\n    # ... Alice Coder simpler BST attempt ...',
    predictedOutcome: { willPass: true },
    actualOutcome: { willPass: false, reasoning: 'Solution only checks immediate children, not the entire subtree constraints for BST validity.' },
    isCorrect: false,
    pointsEarned: 0,
    submissionDate: new Date(new Date(mockChallenges[3].deadline).getTime() - (1000 * 60 * 60 * 3)).toISOString()
  },
  // Add some predictions for open challenges for betting demo
  {
    id: 'pred5',
    userId: 'user2', // Bob
    challengeId: 'challenge1', // Two Sum (open)
    submittedCode: '// Bob solution for Two Sum',
    predictedOutcome: { willPass: true },
    submissionDate: new Date().toISOString(),
    pointsEarned: 0, // Not resolved yet
  },
  {
    id: 'pred6',
    userId: 'user3', // Charlie
    challengeId: 'challenge1', // Two Sum (open)
    submittedCode: '// Charlie solution for Two Sum',
    predictedOutcome: { willPass: false },
    submissionDate: new Date().toISOString(),
    pointsEarned: 0, // Not resolved yet
  },
];

export let mockProposedBets: ProposedBet[] = []; // Changed to let

// Function to get a challenge by ID
export const getChallengeById = (id: string): Challenge | undefined => {
  return mockChallenges.find(challenge => challenge.id === id);
};

// Function to get predictions for a challenge
export const getPredictionsForChallenge = (challengeId: string): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.challengeId === challengeId);
};

// Function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

// Function to get predictions by *other* users for a challenge
export const getPredictionsByOtherUsers = (challengeId: string, currentUserId: string): (Prediction & { user?: User })[] => {
  return mockPredictions
    .filter(p => p.challengeId === challengeId && p.userId !== currentUserId)
    .map(p => ({ ...p, user: getUserById(p.userId) }));
};

// Function to propose a new bet
export const proposeBet = (
  challengeId: string,
  proposingUserId: string,
  targetUserId: string,
  targetPredictionId: string,
  betAmount: number
): ProposedBet => {
  const newBet: ProposedBet = {
    id: generateId(),
    challengeId,
    proposingUserId,
    targetUserId,
    targetPredictionId,
    betAmount,
    status: 'pending_acceptance',
    createdAt: new Date().toISOString(),
  };
  mockProposedBets.push(newBet);
  return newBet;
};

// Function to get all proposed bets for a challenge
export const getProposedBetsForChallenge = (challengeId: string): (ProposedBet & { proposingUser?: User, targetUser?: User })[] => {
  return mockProposedBets
    .filter(bet => bet.challengeId === challengeId)
    .map(bet => ({
      ...bet,
      proposingUser: getUserById(bet.proposingUserId),
      targetUser: getUserById(bet.targetUserId),
    }));
};

// Function to add a new prediction (e.g. from prediction modal)
export const addPrediction = (predictionData: Omit<Prediction, 'id' | 'submissionDate' | 'pointsEarned' | 'actualOutcome' | 'isCorrect'>): Prediction => {
    const newPrediction: Prediction = {
        ...predictionData,
        id: generateId(),
        submissionDate: new Date().toISOString(),
        pointsEarned: 0, // Default, updated upon resolution
    };
    mockPredictions.push(newPrediction);
    // Update user score if prediction is part of initial data that implies points
    // For now, score updates happen elsewhere or are part of mock data setup
    return newPrediction;
};
