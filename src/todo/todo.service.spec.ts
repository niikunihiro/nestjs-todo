import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { Connection } from 'typeorm';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  const mockConnection = () => ({
    transaction: jest.fn(),
  });

  const mockTodo: Todo = {
    id: 1,
    title: 'hello my first todo',
    content: 'TODOの登録ですよー',
    created_at: '2021-10-05T15:28:58.000Z',
    updated_at: '2021-10-05T15:28:58.000Z',
  };

  const mockTodos = [
    mockTodo,
    { ...mockTodo, id: 2 },
    { ...mockTodo, id: 3 },
    { ...mockTodo, id: 4 },
  ];

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: () => mockTodos,
          },
        },
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
    }).compile();

    service = moduleRef.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should test getTodos', async () => {
    const todos = await service.getTodos();
    expect(mockTodos).toEqual(todos);
  });
});
