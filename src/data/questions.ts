import { Question } from '../types';

export const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

export const questions: Question[] = [
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: `A${i + 1}`,
    section: 'A' as const,
    sectionName: 'Part A: Repeat',
    instruction: 'Please repeat the sentence you read.',
    prompt: [
      'Please sit down.',
      'Leave your bags at the door.',
      'We are going to start the meeting now.',
      'Can I get you something to drink?'
    ][i % 4],
    type: 'repeat' as const,
    correctAnswer: [
      'Please sit down.',
      'Leave your bags at the door.',
      'We are going to start the meeting now.',
      'Can I get you something to drink?'
    ][i % 4],
    marks: 1,
    tip: 'Speak clearly and at a normal pace.'
  })),
  ...Array.from({ length: 8 }).map((_, i) => {
    const raw = ['my going friend to is house the', 'early arrived we the at station', 'please me call tomorrow morning', 'he English speaking very in good is'];
    const correct = ['My friend is going to the house.', 'We arrived early at the station.', 'Please call me tomorrow morning.', 'He is very good in speaking English.'];
    return {
      id: `B${i + 1}`,
      section: 'B' as const,
      sectionName: 'Part B: Sentence Building',
      instruction: 'Arrange the jumbled words to form a correct sentence.',
      prompt: 'Arrange these words:',
      jumbledWords: raw[i % 4].split(' '),
      type: 'build' as const,
      correctAnswer: correct[i % 4],
      marks: 1,
      tip: 'Pay attention to grammar and logical sentence order.'
    };
  }),
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `C${i + 1}`,
    section: 'C' as const,
    sectionName: 'Part C: Conversation',
    instruction: 'Read the conversation and answer the question.',
    prompt: [
      "- I forgot my umbrella.\\n- Don't worry, I have an extra one you can borrow.\\n\\nQuestion: What does the second person offer?",
      "- Is the train on time?\\n- No, it is delayed by twenty minutes.\\n\\nQuestion: How long is the train delayed?",
      "- I would like to book a table for two.\\n- Certainly, for what time?\\n\\nQuestion: What is the first person doing?",
      "- I need to review these reports by tomorrow.\\n- I can help you with half of them.\\n\\nQuestion: What is the second person offering?"
    ][i % 4],
    options: [
      ['An umbrella', 'A raincoat', 'A ride home', 'Some money'],
      ['Ten minutes', 'Twenty minutes', 'An hour', 'It is on time'],
      ['Canceling a reservation', 'Booking a table', 'Ordering food', 'Asking for the bill'],
      ['To write the reports', 'To help with half of the reports', 'To review all reports', 'To leave work early']
    ][i % 4],
    type: 'conversation' as const,
    correctAnswer: ['An umbrella', 'Twenty minutes', 'Booking a table', 'To help with half of the reports'][i % 4],
    marks: 1,
    tip: 'Focus on the main idea of the conversation.'
  })),
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: `D${i + 1}`,
    section: 'D' as const,
    sectionName: 'Part D: Sentence Completion',
    instruction: 'Type one word to complete the sentence.',
    prompt: [
      'The sky is very _______ today, I do not see any clouds.',
      'Please turn off the _______ before you leave the room.',
      'He went to the _______ to buy some fresh bread.',
      'I am so _______, I need to drink some water.'
    ][i % 4],
    type: 'completion' as const,
    correctAnswer: [
      ['clear', 'blue'],
      ['lights', 'light'],
      ['bakery', 'store', 'shop'],
      ['thirsty', 'dry']
    ][i % 4],
    marks: 1,
    tip: 'Ensure the word fits grammatically.'
  })),
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: `E${i + 1}`,
    section: 'E' as const,
    sectionName: 'Part E: Dictation',
    instruction: 'Type exactly what you read/hear.',
    prompt: [
      'The quick brown fox jumps over the lazy dog.',
      'We are leaving for the airport early in the morning.',
      'Your package has been delivered to the front desk.',
      'Make sure you save all your files before closing the program.'
    ][i % 4],
    type: 'dictation' as const,
    correctAnswer: [
      'The quick brown fox jumps over the lazy dog.',
      'We are leaving for the airport early in the morning.',
      'Your package has been delivered to the front desk.',
      'Make sure you save all your files before closing the program.'
    ][i % 4],
    marks: 1,
    tip: 'Pay attention to exact words, plural forms, and punctuation.'
  })),
  ...Array.from({ length: 2 }).map((_, i) => ({
    id: `F${i + 1}`,
    section: 'F' as const,
    sectionName: 'Part F: Passage Reconstruction',
    instruction: 'Read the paragraph. It will disappear after 30 seconds. Then rewrite it from memory.',
    prompt: [
      'Yesterday, Sarah went to the grocery store to buy ingredients for a cake. She bought flour, sugar, and eggs. However, she forgot to buy milk, so she had to borrow some from her neighbor. The cake turned out delicious and everyone enjoyed it at the party.',
      'The company announced its new product line during the annual conference. They expect a twenty percent increase in sales over the next quarter. The CEO emphasized the importance of innovation and teamwork to achieve these ambitious goals.'
    ][i],
    type: 'reconstruction' as const,
    correctAnswer: [
      'Yesterday, Sarah went to the grocery store to buy ingredients for a cake. She bought flour, sugar, and eggs. However, she forgot to buy milk, so she had to borrow some from her neighbor. The cake turned out delicious and everyone enjoyed it at the party.',
      'The company announced its new product line during the annual conference. They expect a twenty percent increase in sales over the next quarter. The CEO emphasized the importance of innovation and teamwork to achieve these ambitious goals.'
    ][i],
    marks: 6,
    timeLimit: 30, // 30 seconds to read
    tip: 'Focus on remembering the key characters, actions, and sequence of events. Do not worry about word-for-word accuracy.'
  }))
];
