/**
 * Fun & Games Handler
 * Implements entertainment commands: fact, jokes, memes, quotes, trivia, truth or dare, etc.
 */

const Logger = require('../config/logger');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = new Logger('FunAndGamesHandler');

class FunAndGamesHandler {
  constructor(messageService = null) {
    this.messageService = messageService;
  }

  setMessageService(messageService) {
    this.messageService = messageService;
  }

  /**
   * Main game command handler - routes all game commands
   */
  async handleGameCommand(command, args, from, cleanPhone) {
    try {
      switch (command) {
        case 'fun':
          return await this.handleFunCommand(null, from);
        case 'fact':
          return await this.handleFactCommand(null, from);
        case 'jokes':
          return await this.handleJokesCommand(null, from);
        case 'quotes':
          return await this.handleQuotesCommand(null, from);
        case 'trivia':
          return await this.handleTriviaCommand(null, from);
        case 'truthordare':
          return await this.handleTruthOrDareCommand(null, from);
        case 'truth':
          return await this.handleTruthCommand(null, from);
        case 'dare':
          return await this.handleDareCommand(null, from);
        default:
          return await this.messageService.sendTextMessage(from, '❌ Unknown game command');
      }
    } catch (error) {
      console.error('Error in game handler:', error);
      return await this.messageService.sendTextMessage(from, `❌ Game error: ${error.message}`);
    }
  }

  /**
   * !fun - Show fun menu
   */
  async handleFunCommand(phoneNumber, from) {
    const funMenu = {
      text: `🎮 *FUN & ENTERTAINMENT MENU*\n\nChoose an activity:`,
      footer: '━━━━━━ Smart Bot ━━━━━━',
      sections: [{
        title: 'Activities',
        rows: [
          { id: 'fact', title: '📚 Random Fact', description: 'Get an interesting fact' },
          { id: 'jokes', title: '😂 Jokes', description: 'Get a random joke' },
          { id: 'quotes', title: '✨ Quotes', description: 'Get inspirational quotes' },
          { id: 'trivia', title: '🧠 Trivia', description: 'Play trivia quiz' },
          { id: 'truthordare', title: '🎭 Truth or Dare', description: 'Play truth or dare' }
        ]
      }],
      buttonText: 'Select Activity',
      title: 'Fun Menu'
    };

    await this.messageService.sendInteractiveMessage(from, { listMessage: funMenu });
    return { success: true };
  }

  /**
   * !fact - Get random fact
   */
  async handleFactCommand(phoneNumber, from) {
    const facts = [
      'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.',
      'The Great Wall of China is not visible from space without aid.',
      'Octopuses have three hearts and blue blood.',
      'A group of flamingos is called a "flamboyance".',
      'Bananas are berries, but strawberries are not.',
      'Cleopatra lived closer to the invention of the iPhone than to the construction of the Great Pyramid.',
      'Wombats produce cube-shaped poop.',
      'Scotland\'s national animal is a unicorn.',
      'The fingerprints of koalas are so similar to human fingerprints they have been confused at crime scenes.',
      'A cloud weighs about 1.1 million pounds.',
      'Humans shed about 600,000 particles of skin every minute.',
      'Cats spend 70% of their lives sleeping.',
      'A group of crows is called a "murder".',
      'The smell of petrichor (rain on soil) comes from a chemical called geosmin.',
      'Venus is the only planet that rotates clockwise.'
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    const response = `📚 *RANDOM FACT*\n\n${randomFact}\n\n_Did you know?_`;
    
    await this.messageService.sendTextMessage(from, response);
    return { success: true };
  }

  /**
   * !jokes - Get random joke
   */
  async handleJokesCommand(phoneNumber, from) {
    const jokes = [
      { setup: 'Why don\'t scientists trust atoms?', punchline: 'Because they make up everything!' },
      { setup: 'What do you call a bear with no teeth?', punchline: 'A gummy bear!' },
      { setup: 'Why don\'t eggs tell jokes?', punchline: 'They\'d crack each other up!' },
      { setup: 'What did the ocean say to the beach?', punchline: 'Nothing, it just waved!' },
      { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field!' },
      { setup: 'What do you call a fish wearing a crown?', punchline: 'A king fish!' },
      { setup: 'Why did the math book look sad?', punchline: 'Because it had too many problems!' },
      { setup: 'What do you call fake spaghetti?', punchline: 'An impasta!' },
      { setup: 'Why don\'t skeletons fight each other?', punchline: 'They don\'t have the guts!' },
      { setup: 'What did one wall say to the other wall?', punchline: 'I\'ll meet you at the corner!' }
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    const response = `😂 *JOKE TIME*\n\n*${randomJoke.setup}*\n\n_${randomJoke.punchline}_\n\n😆`;
    
    await this.messageService.sendTextMessage(from, response);
    return { success: true };
  }

  /**
   * !quotes - Get inspirational quote
   */
  async handleQuotesCommand(phoneNumber, from) {
    const quotes = [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
      { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
      { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
      { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
      { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
      { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
      { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
      { text: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
      { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const response = `✨ *INSPIRATIONAL QUOTE*\n\n_"${randomQuote.text}"_\n\n— *${randomQuote.author}*`;
    
    await this.messageService.sendTextMessage(from, response);
    return { success: true };
  }

  /**
   * !trivia - Play trivia quiz
   */
  async handleTriviaCommand(phoneNumber, from) {
    const triviaQuestions = [
      {
        question: 'What is the capital of France?',
        options: ['Paris', 'Lyon', 'Marseille', 'Nice'],
        correct: 0,
        category: 'Geography'
      },
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct: 1,
        category: 'Math'
      },
      {
        question: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Mercury', 'Earth', 'Mars'],
        correct: 1,
        category: 'Science'
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
        correct: 1,
        category: 'Art'
      },
      {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correct: 3,
        category: 'Geography'
      }
    ];

    const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    
    const triviaMessage = {
      text: `🧠 *TRIVIA QUESTION*\n\n📚 *${question.question}*\n\nCategory: ${question.category}`,
      footer: '━━━━━━ Smart Bot ━━━━━━',
      sections: [{
        title: 'Choose an answer:',
        rows: question.options.map((option, idx) => ({
          id: `trivia_${idx}`,
          title: option,
          description: String.fromCharCode(65 + idx) // A, B, C, D
        }))
      }],
      buttonText: 'Answer',
      title: 'Trivia'
    };

    await this.messageService.sendInteractiveMessage(from, { listMessage: triviaMessage });
    return { success: true };
  }

  /**
   * !truthordare - Truth or Dare game
   */
  async handleTruthOrDareCommand(phoneNumber, from) {
    const todMessage = {
      text: `🎭 *TRUTH OR DARE*\n\nChoose wisely! What will it be?`,
      footer: '━━━━━━ Smart Bot ━━━━━━',
      sections: [{
        title: 'Make your choice:',
        rows: [
          { id: 'truth', title: '🤐 Truth', description: 'I\'ll ask you a truth question' },
          { id: 'dare', title: '😎 Dare', description: 'I\'ll give you a challenge' }
        ]
      }],
      buttonText: 'Choose',
      title: 'Truth or Dare'
    };

    await this.messageService.sendInteractiveMessage(from, { listMessage: todMessage });
    return { success: true };
  }

  /**
   * Handle Truth selection in Truth or Dare
   */
  async handleTruthCommand(phoneNumber, from) {
    const truthQuestions = [
      'What is your biggest fear?',
      'Have you ever lied to your best friend?',
      'What is your most embarrassing moment?',
      'What do you dislike about yourself?',
      'Have you ever cheated in an exam?',
      'What is your guilty pleasure?',
      'Who do you have a crush on?',
      'What\'s the weirdest thing you\'ve done?',
      'Have you ever stalked someone on social media?',
      'What\'s something you\'ve never told anyone?'
    ];

    const randomTruth = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
    const response = `🤐 *TRUTH QUESTION*\n\n*${randomTruth}*\n\n_Answer honestly!_`;
    
    await this.messageService.sendTextMessage(from, response);
    return { success: true };
  }

  /**
   * Handle Dare selection in Truth or Dare
   */
  async handleDareCommand(phoneNumber, from) {
    const dares = [
      'Eat 2 tablespoons of rice without any side dishes',
      'Call your crush now and send a screenshot',
      'Sing the chorus of your favorite song',
      'Change your profile picture to a funny meme for 2 hours',
      'Send a voice note saying something embarrassing',
      'Send a selfie making the silliest face possible',
      'Send a message to someone saying "I love you" (just kidding!)',
      'Do 10 push-ups and send a video',
      'Speak in an accent for 10 minutes',
      'Tell a joke to someone and send their reaction'
    ];

    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    const response = `😎 *DARE FOR YOU*\n\n*${randomDare}*\n\n_Send proof when done!_ 📸`;
    
    await this.messageService.sendTextMessage(from, response);
    return { success: true };
  }
}

// Export as singleton instance
module.exports = new FunAndGamesHandler();
