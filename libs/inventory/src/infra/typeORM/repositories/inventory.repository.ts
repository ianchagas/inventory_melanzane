/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */

import { InventoryDTO } from 'libs/inventory/src/dto/request/inventory.dto';
import { IInventoryRepository } from 'libs/inventory/src/implementations/inventory.interface';
import { Repository, UpdateResult } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InventoryEntity } from '../entities/inventory.entity';

@Injectable()
class InventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
  ) {}

  async findActuallyQuantity(id_product: number): Promise<number | undefined> {
    const FindActuallyQuantity = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('quantity')
      .where({ id_product })
      .getRawOne();

    return FindActuallyQuantity;
  }

  async findMovementExists(id_product: number): Promise<InventoryEntity> {
    const FindMovementExists = await this.inventoryRepository.findOne(
      id_product,
    );

    return FindMovementExists;
  }

  async createFirstMovement(data: InventoryDTO): Promise<InventoryEntity> {
    const SaveEntryMovementEachOne = await this.inventoryRepository.save(data);
    return SaveEntryMovementEachOne;
  }

  async updateEntryMovementEachOne(
    id_product: number,
    quantity: number,
  ): Promise<UpdateResult> {
    const UpdateQuantity = this.inventoryRepository.create({
      quantity,
    });

    const Update = await this.inventoryRepository
      .createQueryBuilder()
      .update(UpdateQuantity)
      .where({ id_product })
      .returning(['id_product', 'quantity'])
      .execute();

    return Update;
  }

  async updateEntryMovement(
    id_product: number,
    quantity: number,
    cost_price: number,
  ): Promise<UpdateResult> {
    const UpdateEntryMovement = this.inventoryRepository.create({
      quantity,
      cost_price,
    });

    const Update = await this.inventoryRepository
      .createQueryBuilder()
      .update(UpdateEntryMovement)
      .where({ id_product })
      .returning(['id_product', 'quantity', 'cost_price'])
      .execute();

    return Update;
  }
}

export { InventoryRepository };
