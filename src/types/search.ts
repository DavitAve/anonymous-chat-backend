// Описываем черты характера (приходят с фронта из localStorage или из БД для премиума)
export interface CharacterTraits {
  energy: number;        // от 1 до 10
  talkativeness: number; // от 1 до 10
  logic: number;         // от 1 до 10
  interests: string[];   // массив тегов, например ['it', 'movies', 'music']
}

// Описываем юзера, который висит в очереди (Пуле) и ждет собеседника
export interface QueueUser {
  socketId: string;        // Для отправки сообщений именно этому сокету
  userId: string;          // ID из базы (будет только у авторизованных/премиум юзеров)
  
  age: number;
  gender: string;
  partnerAges: number[];
  partnerGender: string;

  // поля для Умного поиска
  isPremium: boolean;
  traits: CharacterTraits;
  joinedAt: number;
}