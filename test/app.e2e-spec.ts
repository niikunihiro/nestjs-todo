import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateTodoDto } from 'src/todo/dto/create-todo.dto';
import { Todo } from 'src/entity/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { clearDB } from './../src/test.helper';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get('MYSQL_HOST'),
            port: configService.get<number>('MYSQL_PORT'),
            username: configService.get('MYSQL_USER'),
            password: configService.get('MYSQL_PASSWORD'),
            database: configService.get('MYSQL_DATABASE'),
            autoLoadEntities: true,
            synchronize: false,
            logging: false,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // TODO テスト用DBのクリア
  // clearDB();
  describe('AppController (e2e)', () => {
    describe('Read API of App', () => {
      it('/ (GET)', async () => {
        const res = await request(app.getHttpServer()).get('/');
        expect(res.status).toEqual(200);
      });
    });
  });

  // 全件取得のための関数
  const getTodoAll = async (): Promise<Array<Todo>> => {
    const res = await request(app.getHttpServer()).get('/todo');
    expect(res.status).toEqual(200);

    return res.body as Array<Todo>;
  };

  describe('TodoController (e2e)', () => {
    describe('Create API of Todo', () => {
      it('/todo (POST)', async () => {
        // 登録前のデータ数を持っとく
        let todoAllResponse = await getTodoAll();
        const beforeRows = todoAllResponse.length;

        const body: CreateTodoDto = {
          title: 'hello my todo',
          content: 'TODOの登録ですよ',
        };

        // 新規登録
        const res = await request(app.getHttpServer()).post('/todo').send(body);
        expect(res.status).toEqual(201);

        const todoResponse = res.body as Todo;
        expect(todoResponse.title).toEqual(body.title);

        // 登録後のデータ数がインクリメントされてるか確認
        todoAllResponse = await getTodoAll();
        expect(todoAllResponse.length).toEqual(beforeRows + 1);

        // レスポンスの ID を使って GET /todo/:id
        const resGet = await request(app.getHttpServer()).get(
          '/todo/' + todoResponse.id.toString(),
        );
        expect(resGet.status).toEqual(200);
        const todoGetResponse = resGet.body as Todo;
        expect(todoGetResponse.title).toEqual(body.title);
      });
    });

    describe('Read API of Todo', () => {
      /* 
      // これは再実行時には失敗するので隠しとく
      it('OK /todo (GET)', async () => {
        const todoResponse = await getTodoAll();
        expect(todoResponse.length).toEqual(3);
      });
       */
      it('OK /todo/:id (GET)', async () => {
        const todoResponse = await getTodoAll();
        const res = await request(app.getHttpServer()).get(
          `/todo/${todoResponse[0].id}`,
        );
        expect(res.status).toEqual(200);
      });

      it('NG /todo/:id (GET): Invalid id', async () => {
        const res = await request(app.getHttpServer()).get(`/todo/0`);
        expect(res.status).toEqual(404);
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
