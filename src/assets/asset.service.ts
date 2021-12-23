import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository} from "typeorm";
import { Assets } from "./assets.entity";

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Assets)
    private assetsRepository: MongoRepository<Assets>
  ) {}

  async getById(id: string) {
    return (await this.assetsRepository.findOne(id));
  }
  async getAssets(): Promise<Assets[]> {
    return await this.assetsRepository.find();
  }
  async save(asset: Partial<Assets>): Promise<Assets> {
    return await this.assetsRepository.save(new Assets(asset));
  }
  async update(id: any, asset: Partial<Assets>): Promise<void> {
    await this.assetsRepository.update(id, asset);
  }
  async delete(id: any): Promise<void> {
    await this.assetsRepository.delete(id);
  }
}