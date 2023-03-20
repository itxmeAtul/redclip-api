import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { printPdf } from './utilities/printUtility';

@Controller('redclipApp')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  async getHello() {
    return this.appService.getHello();
  }

  @Post('printInvoice')
  printInvoice(@Body('data') data: any, @Res() res: Response): any {
    return printPdf('sample', data, null).then((pdf) => {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length,
      });
      res.status(HttpStatus.CREATED).send(pdf);
    });
  }
}
