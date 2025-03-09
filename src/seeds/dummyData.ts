import { hashSync } from 'bcrypt';

// 🔹 더미 데이터 (비밀번호는 미리 해싱)
export const restaurants = [
  { id: 1, username: 'restaurant1', password: hashSync('pass123', 10) },
  { id: 2, username: 'restaurant2', password: hashSync('pass123', 10) },
];

export const customers = [
  { id: 1, username: 'customer1', password: hashSync('pass123', 10) },
  { id: 2, username: 'customer2', password: hashSync('pass123', 10) },
  { id: 3, username: 'customer3', password: hashSync('pass123', 10) },
];
