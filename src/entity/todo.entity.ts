import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column('datetime')
  created_at: string;

  @Column('datetime')
  updated_at: string;
}
