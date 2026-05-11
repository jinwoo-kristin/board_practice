import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseTimeEntity } from '../common/entities/base-time.entity';

@Entity()
export class Post extends BaseTimeEntity {
  constructor(partial?: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @ManyToOne(() => User)
  user!: User;

  update(title: string, content: string): void {
    this.title = title;
    this.content = content;
  }
}
