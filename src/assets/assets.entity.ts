import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('assets')
export class Assets {
  @ObjectIdColumn() id: ObjectID;
  @Column() name: string;
  @Column() description?: string;
  @Column() cost: number;
  @Column() user: string[];
  @Column() categories: string[];

  constructor(assets?: Partial<Assets>) {
    Object.assign(this, assets);
  }
}