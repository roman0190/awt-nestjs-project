
// buyer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';
import { Address } from './address.entity';
import { Order } from './order.entity';
//import { ManagerEntity } from "src/manager/manager.entity";
import { JwtService } from '@nestjs/jwt';
import { BuyerDto, loginDTO, addressDto, orderDto } from "./buyer.dto";

@Injectable()
export class BuyerService {
  
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    private jwtService: JwtService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) {}
 


  async addBuyer(myobj: Buyer): Promise<Buyer> {
    return await this.buyerRepository.save(myobj);
}

  getAll(): Promise<Buyer[]> {
    return this.buyerRepository.find(
      {
        select:{
          name: true,
          email: true,
          password:true,
          gender:true,
          phone:true
        }
        
      }
    );
  }

  
  async findOne( logindata:loginDTO): Promise<any> {
    return await this.buyerRepository.findOneBy({email:logindata.email});
  }

//   async searchBuyer(logindata:loginDTO): Promise<Buyer> {
//     return await this.buyerRepository.findOneBy({email:logindata.email});
// }
  

async updateBuyer(email: string, updateData: { name?: string, phone?: string }): Promise<any> {
  return this.buyerRepository.update({ email }, updateData);
}


async deleteBuyer(buyerId: number): Promise<void> {
  // Implementation for deleting a user from the system
  await this.buyerRepository.delete(buyerId);
}

  


// order

async createOrder(order: Order, email:string): Promise<Order> {
  //const id=1
  const buyer= await this.buyerRepository.findOneBy({email:email})
  console.log(buyer);
  //const order = new Order
  order.product=order.product
  order.buyer = buyer
  //const order = this.orderRepository.save(orderDto);
  return this.orderRepository.save(order);
}

async getAllOrders(): Promise<Order[]> {
  return this.orderRepository.find();
}

async getOrderById(id: number): Promise<Order> {
  return this.orderRepository.findOneBy({id:id});
}

// async updateOrder(email:string, orderDto: orderDto): Promise<object> {
//   const update = await this.buyerRepository.findOneBy({email:email})
//   return await this.orderRepository.update(update.Id, orderDto);
//   //return this.getOrderById(id);
// }

async updateOrder(id: number, orderDto: orderDto): Promise<Order> {
  await this.orderRepository.update(id, orderDto);
  return this.getOrderById(id);
}

// async getOrderByEmail(email: string): Promise<Order> {
//   return this.orderRepository.findOneBy({ email: email });
// }

// async updateOrder(email: string, orderDto: orderDto): Promise<Order> {
//   const order = await this.orderRepository.findOneBy({ email:email });
//   if (!order) {
//     throw new NotFoundException(`Order for user with email ${email} not found`);
//   }
//   await this.orderRepository.update(order.email, orderDto);
//   return this.orderRepository.findOne(order.email);
// }

async deleteOrder(id: number): Promise<void> {
  await this.orderRepository.delete(id);
}


// address

async createAddress(address: Address, email:string): Promise<Address> {
  //const address = this.addressRepository.create(addressDto);
  const buyer = await this.buyerRepository.findOneBy({email:email})
  //const address = new Address
  address.street = address.street
  address.city=address.city
  address.buyer = buyer
  return this.addressRepository.save(address);
}

async getAllAddresses(): Promise<Address[]> {
  return this.addressRepository.find();
}

async getAddressById(id: number): Promise<Address> {
  return this.addressRepository.findOneBy({id:id});
}

async updateAddress(id: number, addressDto: addressDto): Promise<Address> {
  await this.addressRepository.update(id, addressDto);
  return this.getAddressById(id);
}


// async getAddressByEmail(email: string): Promise<Address> {
//   return this.addressRepository.findOne({ userEmail: email });
// }

// async updateAddress(userEmail: string, addressDto: addressDto): Promise<Address> {
//   const address = await this.addressRepository.findOne({ userEmail });
//   if (!address) {
//     throw new NotFoundException(`Address for user with email ${userEmail} not found`);
//   }
//   await this.addressRepository.update(address.id, addressDto);
//   return this.addressRepository.findOne(address.id);
// }



async deleteAddress(id: number): Promise<void> {
  await this.addressRepository.delete(id);
}
}
