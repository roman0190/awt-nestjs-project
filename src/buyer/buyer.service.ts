
// buyer.service.ts
import { Injectable } from '@nestjs/common';
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

  getUsers(): Promise<Buyer[]> {
    return this.buyerRepository.find();
  }
  getUsersById(id: number): object { //Promise<Buyer>
      return this.buyerRepository.findOneBy({Id:id});
  }
  getUsersByNameAndId(name: string, id: string): object {
      return {
          message: "You id is " + name +
              " and your id is " + id
      };

  }

  async addBuyer(myobj: BuyerDto): Promise<Buyer> {
      return await this.buyerRepository.save(myobj);
  }
  async getAllBuyer(): Promise<Buyer[]> {
      return this.buyerRepository.find({ relations: ['']});
  }
  
  async findOne( logindata:loginDTO): Promise<any> {
    return await this.buyerRepository.findOneBy({email:logindata.email});
  }

  async createBuyer(buyer: BuyerDto): Promise<Buyer> {
    return  this.buyerRepository.save(buyer);
  }

  async modifyPhoneNumber(buyerId: number, newPhoneNumber: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({ where: { Id: buyerId } });
    if (!buyer) {
      return null;
    }
    buyer.phone = newPhoneNumber;
    return this.buyerRepository.save(buyer);
  }

  async getBuyerWithNullFullName(): Promise<Buyer[]> {
    return this.buyerRepository.createQueryBuilder('buyer')
      .where('buyer.fullName IS NULL')
      .getMany();
  }

  async deleteBuyer(buyerId: number): Promise<void> {
    // Implementation for deleting a user from the system
    await this.buyerRepository.delete(buyerId);
  }

  // order

  async createOrder(orderDto: orderDto, id:number): Promise<Order> {
    //const id=1
    const buyer= await this.buyerRepository.findOneBy({Id:id})
    //console.log(buyer);
    const order = new Order
    order.product=orderDto.product
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

  async updateOrder(id: number, orderDto: orderDto): Promise<Order> {
    await this.orderRepository.update(id, orderDto);
    return this.getOrderById(id);
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }


  // address

  async createAddress(address: addressDto): Promise<Address> {
    //const address = this.addressRepository.create(addressDto);
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

  async deleteAddress(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
