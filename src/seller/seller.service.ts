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
