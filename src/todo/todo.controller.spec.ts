import { Todo } from '../entity/todo.entity';
import { NowProvider } from '../date/now.provider';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

jest.mock('./todo.service');

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(() => {
    const todoServiceMock = TodoService as jest.Mock;
    todoService = new todoServiceMock() as TodoService;
    todoController = new TodoController(todoService, new NowProvider());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('/todo', () => {
    it('should return some todos', () => {
      jest.spyOn(todoService, 'getTodos').mockImplementation(() => {
        const todo: Todo = {
          id: 1,
          title: 'hello my first todo',
          content: 'this is mock',
          created_at: '2021-10-05T15:28:58.000Z',
          updated_at: '2021-10-05T15:28:58.000Z',
        };
        return Promise.resolve([todo, todo]);
      });

      void expect(todoController.getTodos()).resolves.toHaveLength(2);
    });
  });
});
