import { ApiProperty } from '@nestjs/swagger';
import { Todo } from 'src/entity/todo.entity';

export class GetTodosResponse {
  @ApiProperty({
    type: [Todo],
    example: [
      {
        id: 1,
        title: 'my new todo',
        text: 'wake up at 8.',
        created_at: '2021-11-11 11:11:11',
        updated_at: '2021-11-11 11:11:11',
      },
    ],
  })
  todo: Todo[];
}
