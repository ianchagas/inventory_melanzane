/* eslint-disable no-param-reassign */
import { UpdateResult } from 'typeorm';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CategoryDTO } from '../../dto/request/category.dto';
import { ICategoryRepository } from '../../implementations/category.interface';
import { CategoryRepository } from '../../infra/typeORM/repositories/category.repository';

interface IRequest {
  uuid: string;
  updateCategoryDTO: CategoryDTO;
}

@Injectable()
export class UpdateCategoryService {
  constructor(
    @Inject(CategoryRepository)
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({ uuid, updateCategoryDTO }: IRequest): Promise<UpdateResult> {
    const CategoryExists = await this.categoryRepository.findCategoryByUUID(
      uuid,
    );

    if (!CategoryExists) {
      throw new NotFoundException('Unidade de Medida não encontrada');
    }

    updateCategoryDTO.uuid = CategoryExists.uuid;

    return this.categoryRepository.update(updateCategoryDTO);
  }
}
