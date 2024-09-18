import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  // @WebSocketServer() server: Server;

  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }
}
