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
export class SellerService {
  registerUser(user: UserDTO): object {
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

  createGig(data: any): object {
    gigs.push(data);
    return { success: true, ...data };
  }
  editGig(id: string, data: any): object {
    gigs = gigs.map((gig) => (gig.id === id ? { ...gig, ...data } : gig));
    let gig = gigs.find((gig) => gig.id === id);
    if (!gig) return { success: false, message: `no gig with id=${id}` };
    return { success: true, queryid: id, ...gig };
  }
  deleteGig(id: string): object {
    gigs = gigs.filter((gig) => gig.id === id);
    return { success: true, message: 'deleted' };
  }
  getGig(id: string): object {
    let gig = gigs.find((gig) => gig.id === id);
    if (!gig) return { success: false, message: 'gig does not exist' };
    return { success: true, gig };
  }
  getAllGigs(): object {
    return { success: true, gigs };
  }
}
