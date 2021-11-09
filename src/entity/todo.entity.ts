import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @ApiProperty({ example: 123, description: 'TODO ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'my frist todo', description: 'title of todo' })
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty({
    example: 'my frist todo content',
    description: 'text of todo',
  })
  @Column('text')
  content: string;

  @ApiProperty({ example: '2021-11-11 11:11:11', description: '登録日時' })
  @Column('datetime')
  created_at: string;

  @ApiProperty({ example: '2021-11-11 11:11:11', description: '更新日時' })
  @Column('datetime')
  updated_at: string;
}
