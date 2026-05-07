import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../common/entities/base-time.entity';

@Entity()
export class User extends BaseTimeEntity {
  constructor(partial?: Partial<User>) {
    // todo 생성자 오버라이딩 방법
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
}
