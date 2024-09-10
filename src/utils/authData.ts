// File: src/utils/authData.ts

interface User {
  username: string;
  password: string;
}

export const authData: User[] = [
  { username: "0001", password: "1001" },
  { username: "0002", password: "1002" },
  { username: "8510", password: "1426" },
  // ... Tambahkan lebih banyak pengguna sesuai kebutuhan
  { username: "0900", password: "1900" },
];

export function authenticateUser(username: string, password: string): boolean {
  return authData.some(
    (user) => user.username === username && user.password === password,
  );
}
