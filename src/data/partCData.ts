export interface ConversationScript {
  prompt: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const partCData: ConversationScript[] = [
  {
    prompt: "Man: Can you believe how much snow we got last night? I had to shovel for an hour just to get my car out.\nWoman: Tell me about it! The buses are all delayed too. I ended up walking to work.\nMan: Well, at least you don't have to worry about finding parking.",
    question: "How did the woman get to work?",
    options: ["She took the bus.", "She drove her car.", "She walked.", "She took a taxi."],
    correctAnswer: "She walked."
  },
  {
    prompt: "Woman: Excuse me, do you know what time the next train to the city center leaves?\nMan: Yes, it leaves in about 15 minutes, at 3:45. But you should track it on the app because there have been some delays on this line today.\nWoman: Thanks, I'll do that. Which platform is it usually on?\nMan: Platform 4.",
    question: "What time does the next train leave?",
    options: ["3:15", "3:30", "3:45", "4:00"],
    correctAnswer: "3:45"
  },
  {
    prompt: "Man: I'm calling to make a reservation for Friday night at 7:00 PM. Do you still have a table for four?\nWoman: I'm sorry, sir, but we're fully booked at 7:00. However, I can offer you a table at 8:30 or 6:00 PM if that works for you.\nMan: Hmm, let's go with 8:30. My name is Jensen.",
    question: "What time is the reservation for?",
    options: ["6:00 PM", "7:00 PM", "7:30 PM", "8:30 PM"],
    correctAnswer: "8:30 PM"
  },
  {
    prompt: "Woman: Hey, did you finish the marketing report yet? The boss wants to review it before the meeting tomorrow.\nMan: I'm almost done. I just need to add the graphs for the last quarter's sales. It should be ready by lunch.\nWoman: Great. Send it to me when you're done, and I'll proofread it for you.",
    question: "What does the man still need to add to the report?",
    options: ["The new marketing budget.", "Graphs for the last quarter's sales.", "A summary of the meeting.", "Pictures of the products."],
    correctAnswer: "Graphs for the last quarter's sales."
  },
  {
    prompt: "Man: My computer screen keeps freezing every time I try to open this specific spreadsheet. I think the file might be corrupted.\nWoman: Hmm, have you tried restarting your computer? Sometimes that clears up the memory issues.\nMan: I did that twice already, but it didn't help. I'm going to call IT.",
    question: "What is the man's problem?",
    options: ["He can't find a spreadsheet.", "His computer screen keeps freezing.", "He forgot his password.", "His internet connection is down."],
    correctAnswer: "His computer screen keeps freezing."
  },
  {
    prompt: "Woman: Excuse me, where can I find the dairy products? I've been looking everywhere for butter.\nMan: They are in aisle 12, right next to the bakery section. But the butter is actually kept in a separate refrigerated display near the milk.\nWoman: Oh, I see it now. Thank you so much!",
    question: "Where is the butter located?",
    options: ["In aisle 10.", "Next to the bakery section.", "In a refrigerated display near the milk.", "By the cash register."],
    correctAnswer: "In a refrigerated display near the milk."
  },
  {
    prompt: "Man: Are you going to the company picnic this Saturday? It's going to be at Centennial Park.\nWoman: I was planning to, but my sister is coming to town this weekend unexpectedly. I need to pick her up from the airport on Saturday afternoon.\nMan: That's a shame. Maybe you can bring her along if she arrives early enough.",
    question: "Why can't the woman attend the company picnic?",
    options: ["She has to work.", "She is sick.", "She has to pick up her sister from the airport.", "She doesn't know where the park is."],
    correctAnswer: "She has to pick up her sister from the airport."
  },
  {
    prompt: "Woman: Can I please have a medium latte and a blueberry muffin?\nMan: I'm sorry, we just sold out of the blueberry muffins. We have chocolate chip or banana nut muffins left. Or I can offer you a croissant.\nWoman: A croissant sounds good, I'll have that instead.",
    question: "What does the woman order instead of a blueberry muffin?",
    options: ["A banana nut muffin.", "A chocolate chip muffin.", "A croissant.", "A bagel."],
    correctAnswer: "A croissant."
  },
  {
    prompt: "Man: Did you hear about the road closures downtown this weekend? They're having a big marathon.\nWoman: Yes, I read about it. I have tickets to a play on Saturday evening, so I guess I'll have to take the subway instead of driving.\nMan: Good idea. The streets will be packed with runners and spectators.",
    question: "Why will the road closures happen downtown?",
    options: ["A music festival.", "A big marathon.", "Construction work.", "A parade."],
    correctAnswer: "A big marathon."
  },
  {
    prompt: "Woman: How much are these headphones? There's no price tag on the box.\nMan: Let me scan them for you. They're on sale this week for $45, down from $60.\nWoman: Perfect! I'll take them.",
    question: "How much do the headphones cost on sale?",
    options: ["$45", "$50", "$60", "$65"],
    correctAnswer: "$45"
  },
  {
    prompt: "Man: I'm looking for a book on basic gardening. Do you have any recommendations?\nWoman: Yes, we have a whole section on gardening in the back left corner. Let me show you a really popular one for beginners called 'The Easy Garden'.\nMan: Thank you, I'll take a look at it.",
    question: "What kind of book is the man looking for?",
    options: ["A book on advanced farming.", "A book on basic gardening.", "A cookbook.", "A book about landscaping."],
    correctAnswer: "A book on basic gardening."
  },
  {
    prompt: "Woman: My flight was canceled due to the storm, and the next available one isn't until tomorrow morning.\nMan: That's terrible. Did the airline offer you a hotel voucher for the night?\nWoman: Yes, they gave me one for the hotel right across from the airport, but I had to wait in line for an hour to get it.",
    question: "Where is the hotel the woman will stay at?",
    options: ["In the city center.", "Right across from the airport.", "Next to the train station.", "Near her house."],
    correctAnswer: "Right across from the airport."
  }
];
