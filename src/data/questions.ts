import { Question } from '../types';

export const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

const partBData = [
  { p: ["the horse", "the cowboy", "rides on"], a: "The cowboy rides on the horse." },
  { p: ["the falling", "very pretty", "leaves are"], a: "The falling leaves are very pretty." },
  { p: ["the dishes", "did you", "finish cleaning"], a: "Did you finish cleaning the dishes?" },
  { p: ["to the library", "Eric once", "to drive"], a: "Eric once to drive to the library." },
  { p: ["rain today", "it is going to", "I think"], a: "I think it is going to rain today." },
  { p: ["what movie", "last night", "did you watch"], a: "What movie did you watch last night?" },
  { p: ["yourself", "it", "do"], a: "Do it yourself." },
  { p: ["in", "bed", "stay"], a: "Stay in bed." },
  { p: ["all the coffee", "he", "drank"], a: "He drank all the coffee." },
  { p: ["for the test", "studied a lot", "I"], a: "I studied a lot for the test." },
  { p: ["she didn't notice", "the book", "who took"], a: "She didn't notice who took the book." },
  { p: ["I haven't been", "restaurant", "to a Japanese"], a: "I haven't been to a Japanese restaurant." },
  { p: ["Was my sister", "who called me", "the person"], a: "The person who called me was my sister." },
  { p: ["We wondered", "would fit in here", "whether the new piano"], a: "We wondered whether the new piano would fit in here." },
  { p: ["The packet", "tomorrow morning", "will be sent"], a: "The packet will be sent tomorrow morning." },
  { p: ["I have", "my homework", "finished"], a: "I have finished my homework." },
  { p: ["The samples", "last week", "were delivered"], a: "The samples were delivered last week." },
  { p: ["Was reading", "my mother", "her favourite magazine"], a: "My mother was reading her favourite magazine." },
  { p: ["Very old", "is", "this house"], a: "This house is very old." },
  { p: ["For her birthday", "I sent my mother", "some flowers"], a: "I sent my mother some flowers for her birthday." },
  { p: ["For 8000$", "he had sold", "his small farm"], a: "He had sold his small farm for 8000$." },
  { p: ["In his direction", "I looked", "for a second"], a: "I looked in his direction for a second." },
  { p: ["My boss", "to London", "moved"], a: "My boss moved to London." },
  { p: ["Of your family", "any pictures", "do you have"], a: "Do you have any pictures of your family?" },
  { p: ["To their leader", "listen carefully", "the young man"], a: "The young man listen carefully to their leader." },
  { p: ["Real smiles and fake smiles", "by different parts of the brain", "are controlled"], a: "Real smiles and fake smiles are controlled by different parts of the brain." },
  { p: ["Of those weeks", "had one", "have you ever"], a: "Have you ever had one of those weeks?" },
  { p: ["Requires some preparation", "at a job interview", "making a good impression"], a: "Making a good impression at a job interview requires some preparation." },
  { p: ["Shows respect", "being punctual", "in Korea"], a: "Being punctual in Korea shows respect." },
  { p: ["You should", "about your experience and qualifications", "speak"], a: "You should speak about your experience and qualifications." },
  { p: ["Your business card directly", "to present", "remember"], a: "Remember to present your business card directly." },
  { p: ["Haven't you", "abroad", "you've lived"], a: "You've lived abroad, haven't you?" },
  { p: ["For myself", "to buy one", "I'd like"], a: "I'd like to buy one for myself." },
  { p: ["Many farmers", "growing corn", "stopped"], a: "Many farmers stopped growing corn." },
  { p: ["The green ones", "than the blue ones", "are more expensive"], a: "The green ones are more expensive than the blue ones." },
  { p: ["Receive a bonus", "the workers", "will not"], a: "The workers will not receive a bonus." },
  { p: ["That my computer", "sometimes I wish", "would be more reliable"], a: "Sometimes I wish that my computer would be more reliable." },
  { p: ["Next week", "when does", "the workshop start"], a: "When does the workshop start next week?" },
  { p: ["For a large bowl", "of chicken soup", "the customer asked"], a: "The customer asked for a large bowl of chicken soup." },
  { p: ["Are they", "where", "going"], a: "Where are they going?" },
  { p: ["You should", "while working", "not eat"], a: "You should not eat while working." },
  { p: ["Where should", "this weekend", "we go"], a: "Where should we go this weekend?" },
  { p: ["The weather", "nice", "should be"], a: "The weather should be nice." },
  { p: ["To the airport", "take him", "she will"], a: "She will take him to the airport." },
  { p: ["Report is", "due today", "that financial"], a: "That financial report is due today." },
  { p: ["You should select", "your family's needs", "insurance that suits"], a: "You should select insurance that suits your family's needs." },
  { p: ["She was ready", "to begin the trial", "the judge told them"], a: "The judge told them she was ready to begin the trial." },
  { p: ["We", "leaving", "are"], a: "We are leaving." },
  { p: ["Tomorrow", "can you still", "pick me up tomorrow"], a: "Can you still pick me up tomorrow?" },
  { p: ["Working", "that radio", "has stopped"], a: "That radio has stopped working." },
  { p: ["Long ago", "were born", "my grand parents"], a: "My grand parents were born long ago." },
  { p: ["Open", "please leave", "the door"], a: "Please leave the door open." },
  { p: ["To the radio", "listening", "I am"], a: "I am listening to the radio." },
  { p: ["Doing", "how are", "you"], a: "How are you doing?" },
  { p: ["Singer", "who is", "your favourite"], a: "Who is your favourite singer?" },
  { p: ["All the", "were broken", "windows"], a: "All the windows were broken." },
  { p: ["This milk", "very good", "doesn't taste"], a: "This milk doesn't taste very good." },
  { p: ["Can't stay", "there", "she"], a: "She can't stay there." },
  { p: ["Worried", "about his father", "raj"], a: "Raj worried about his father." },
  { p: ["Advised her", "to go to bed", "the doctor"], a: "The doctor advised her to go to bed." },
  { p: ["Had been working", "your team", "the hardest"], a: "Your team had been working the hardest." },
  { p: ["Was asleep", "by then", "nearly everybody"], a: "Nearly everybody was asleep by then." },
  { p: ["Has been delivered", "he doesn't know", "if the letter"], a: "He doesn't know if the letter has been delivered." },
  { p: ["Into this country", "three teenagers", "brought the rare painting"], a: "Three teenagers brought the rare painting into this country." },
  { p: ["Was listening to", "my sister", "her favourite music"], a: "My sister was listening to her favourite music." },
  { p: ["Has been repaired", "by her daughter", "the computer"], a: "The computer has been repaired by her daughter." },
  { p: ["A lockdown", "it was", "we thought"], a: "We thought it was a lockdown." },
  { p: ["So small", "is", "the world"], a: "The world is so small." },
  { p: ["Have been", "it could", "something else"], a: "It could have been something else." },
  { p: ["Or cancelled", "the concert", "will be postponed"], a: "The concert will be postponed or cancelled." },
  { p: ["What had occurred", "in her absence", "they discovered"], a: "They discovered what had occurred in her absence." },
  { p: ["Me", "later", "call"], a: "Call me later." },
  { p: ["As many videos", "he will make", "as he can"], a: "He will make as many videos as he can." },
  { p: ["From Mumbai", "the flight", "is delayed"], a: "The flight from Mumbai is delayed." },
  { p: ["Easily offended", "not", "I am"], a: "I am not easily offended." }
];

const partFData = [
  "Thirty years of working as a salesperson, James decided to retire. His first few weeks were spent in relaxation and reading. After a month he got so bored, so he volunteered in an animal rescue centre. He loved working with animals and had a scheduled work every day.",
  "Thank you for choosing us as your learning partner. The certification program that you have chosen is uniquely crafted for full-time employees, who cannot attend classes during their work schedule. The timings of the sessions are fixed in such a way, that no one misses out a single class. We offer night and weekend sessions to learn from your comfort zone. During this program you will get opportunities to meet qualified professionals and experts in the industry. Please feel free to contact me for any queries.",
  "Mary won the Best teacher award for this year. She is well known for her unique and creative style of teaching. Along with the award she got a trip to Paris for a week. Mary and her husband have never been to Paris, so they are very excited for the trip.",
  "Robert went to a restaurant for having dinner. When the waiter brought the bill, he reached for his wallet. But it was not there. Still, he remembered having it earlier. Finally, the waiter found it under the table.",
  "Kevin left home early to visit the dentist. So, he decided to take the subway. He did not know that the subway was under maintenance. He ran back home to take his bicycle. Eventually, he made it on time for the appointment.",
  "Cindy and Claire bought tickets for the play that is going to be held next weekend. But Claire’s brother fell from the bike and broke his arm. He was admitted in the hospital. To cheer him up, Claire gave him her ticket. So that Cindy and Claire’s brother would go to the play together.",
  "Sophia sent an email to all the employees about the new cafeteria, which will be opened on Monday of the following week. To get suggestions from employee she has sent the email. One of the employees suggested to include more vegetarian option in the menu. She thought it was a good idea and planned to implement it.",
  "Sorry about the pay rate confusion. Our budget had been cut off. So, our offer has been limited. More doubts could be cleared directly if you could come back.",
  "James and Ann were driving to the airport. Ann asked James it he had remembered to take his passport. He realized that he had forgotten it. He had left it in his jacket pocket at home. They turned around to pick it up, they arrived at the airport just in time to catch their flight.",
  "I received a couple of good articles about how to be productive every day at work. I think you will find them useful. These were forwarded by our New York branch. Click on the link below to view the articles. You might learn something new.",
  "I was at the International Trade Fair in Rome last week, and it was very exciting. Rome is a beautiful city. There were people from all over the world at the fair. I met a sales manager whose company sells software and it sounded like there might be a business opportunity. I will stay in touch with him as a business contact. I am writing a report of the trip right now and I should be able to send it out by noon today.",
  "Maria and her brother went to the airport. When she was asked for her passport, Maria reached for her purse, but it was not there. She remembered having her passport when she came into the airport. Her brother looked around and found the wallet under his bag.",
  "Laura and her husband 2 tickets to go on a trip to Trinidad and Tobago. She asked her father in law to water the plants while they were away. Her father in law forgot to water the plants because he had too much work. When Laura and her husband came back from the trip, they found all the plants in a bad condition.",
  "John heard that the pizza place near his flat was hiring new bike couriers. He loves to bike, and he also loves pizza, so he decided to apply for the job. When he went to the restaurant for a job interview, he got very nervous and hesitated a lot during the interview. Fortunately, the restaurant manager decided to hire him thanks to his great biking skill.",
  "David worked for a bank for three year. He enjoyed his job, but he wanted to have more career options. He decided to go to the business school. After getting his degree he became a manager at the same bank.",
  "My name is Amy Jones, and I am the new marketing manager. This memo is just to let you know that I will be holding a staff meeting Friday at 9:00 am so that I can introduce myself properly. I look forward to meeting you then.",
  "A man worked in a factory that produced the music boxes, on Saturday’s, he would take his little girl to the factory. All the people who worked on the assembly line would talk to the little girl and she loved the attention. At the end of the day, they would always give her a small music box.",
  "Employees who wish to take time off during the summer should check with their managers in advance. Many people plan to be away from the office during the summer. As a company, we'd like to make sure all projects have enough people working on them before we approve requests for time off.",
  "Sam was on a busy flight that has been delayed. The plane finally landed and arrived at the gate. Then all the passengers got up to get their luggage. The woman in front of Sam accidentally bumped him in the arm. Just as she was apologizing, her bag fell from the overhead compartment and hit him on the head. The woman felt awful. Sam decided he didn't want to fly again any time soon.",
  "John is the sales manager of a small store. An angry customer called him to complain about a home security system that she had recently bought from his store. She told him that it did not work properly because the alarm went off when she was in the house. Initially she demanded a refund, but when John apologized and offered to replace her system with a new one, she agreed.",
  "This is our annual remainder to all the employees. Our hospital is known in our community for excellent customer care. We have been providing friendly and quality services to all our patients and are committed to doing the same again this year. Greet your patients with a smile and hospitality.",
  "David has an exam tomorrow. So, he stayed up late studying. In the morning, his alarm went off, but David knocked the alarm to the floor and it broke. Then, David fell asleep again. When he woke up, he had slept well, but he had missed the exam.",
  "Paul wakes up early everyday so that he can be at work on time. He sets his alarm for the same time every morning. One day Paul’s alarm didn’t go off and he didn’t wake up until noon. He arrived to work very late and missed a meeting.",
  "Kate volunteers at a school. She helps teachers by reading to students and helping them with their homework. She enjoys her time at the school so much that she has decided to become a teacher. All of the teachers that she works with have told her that it would be a wonderful job for her.",
  "Thanks, so much for dinner last night. We had a really good time. We were especially glad to be able to meet your little daughter. I hope you will be able to come to visit us soon. Let us stay in touch",
  "George works in the film industry in Los Angeles. He once thought he would be able to meet famous actors and producers every day. But his job is to edit films, so he is always inside the editing room. He never gets to see the actors in person.",
  "John bought a new phone and was looking forward to trying it out as soon as possible. The moment John got home, he tried to turn it on, but it did not work. He immediately drove back to the store. The salesperson was very nice and showed john how to insert the battery. John was pleased that the phone was working properly, but at the same time, he felt embarrassed because he should have read the instructions.",
  "Corey is a taxi driver. It is his dream job because he loves driving cars. He started the job ten years ago and has been saving up money since then. Soon, he will use this money to start his own Taxi company.",
  "Thank you so much for being so understanding about our delay of shipment. It has been quite difficult to get materials from our suppliers dur to the recent whether conditions. It is an unusual circumstance. In any case, we should be able to ship the products to you tomorrow. In the meantime, if you have any questions, please feel free to contact me."
];

// Fisher-Yates shuffle directly to randomly select 8 items
const shuffledPartB = [...partBData].sort(() => 0.5 - Math.random()).slice(0, 8);
const shuffledPartF = [...partFData].sort(() => 0.5 - Math.random()).slice(0, 2);

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
  ...shuffledPartB.map((item, i) => {
    return {
      id: `B${i + 1}`,
      section: 'B' as const,
      sectionName: 'Part B: Sentence Building',
      instruction: 'Arrange the jumbled words to form a correct sentence.',
      prompt: 'Arrange these words:',
      jumbledWords: item.p,
      type: 'build' as const,
      correctAnswer: item.a,
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
  ...shuffledPartF.map((item, i) => ({
    id: `F${i + 1}`,
    section: 'F' as const,
    sectionName: 'Part F: Passage Reconstruction',
    instruction: 'Read the paragraph. It will disappear after 30 seconds. Then rewrite it from memory.',
    prompt: item,
    type: 'reconstruction' as const,
    correctAnswer: item,
    marks: 6,
    timeLimit: 30, // 30 seconds to read
    tip: 'Focus on remembering the key characters, actions, and sequence of events. Do not worry about word-for-word accuracy.'
  }))
];
