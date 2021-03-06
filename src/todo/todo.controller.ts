import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NowProvider } from '../date/now.provider';
import { Todo } from '../entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetTodosResponse } from './dto/todo.dto';

@ApiBearerAuth()
@ApiTags('todos')
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly now: NowProvider,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Read todos' })
  @ApiResponse({ status: HttpStatus.OK, type: GetTodosResponse })
  async getTodos(): Promise<GetTodosResponse> {
    const todo = await this.todoService.getTodos();
    return { todo };
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Todo })
  async getTodo(@Param('id') id: number): Promise<Todo> {
    const todo = await this.todoService.getTodo(id);
    if (todo instanceof Todo) {
      return todo;
    }
    throw new NotFoundException();
  }

  @Post()
  @HttpCode(201)
  async addTodo(@Body() todo: CreateTodoDto): Promise<Todo> {
    const now = this.now.getNowString();
    todo.created_at = now;
    todo.updated_at = now;
    return this.todoService.addTodo(todo);
  }

  @Put(':id')
  @HttpCode(204)
  async updateTodo(
    @Param('id') id: number,
    @Body() todo: UpdateTodoDto,
  ): Promise<void> {
    todo.updated_at = this.now.getNowString();
    const updateResult = await this.todoService.updateTodo(id, todo);
    if (updateResult.affected === 0) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTodo(@Param('id') id: number): Promise<void> {
    const deleteResult = await this.todoService.deleteTodo(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException();
    }
  }
}
