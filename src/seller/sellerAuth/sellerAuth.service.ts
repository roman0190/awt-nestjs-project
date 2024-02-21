import { Body, Injectable } from '@nestjs/common';

type UserDTO = { username: string; email: string; password: string };

let sellers: UserDTO[] = [
  {
    username: 'john',
    email: 'john@gmail.com',
    password: 'fowihfwsdn',
  },
  {
    username: 'mark',
    email: 'mark@gmail.com',
    password: 'fowihfsgwsdn',
  },
  {
    username: 'john',
    email: 'mark@gmail.com',
    password: 'fowihfwsfsdfdn',
  },
];

const auth = {
  user: null,
  loggedIn: false,
};

let gigs: any = [];

@Injectable()
export class SellerAuthService {
  registerUser(user: any): object {
    sellers.push(user);
    return { ...user, success: true };
  }

  login(creds: { email: string; password: string }): object {
    console.log(creds);
    let user = sellers.find(
      (u) => u.email === creds.email && u.password === creds.password,
    );
    if (!user) {
      return { success: false };
    }

    (auth.loggedIn = true), (auth.user = user);
    return { ...user, success: true };
  }

  logout(): object {
    (auth.loggedIn = false), (auth.user = null);
    return { success: true };
  }
}
