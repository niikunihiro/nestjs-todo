import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class NowProvider {
  private readonly date: Date;
  constructor() {
    // new しない方法があるはず。
    this.date = new Date();
  }

  getNowString() {
    return this.date.toISOString();
  }
}
