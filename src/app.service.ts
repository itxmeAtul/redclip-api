import { Injectable, Logger } from '@nestjs/common';
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const puppeteer = require('puppeteer');

@Injectable()
export class AppService {
  private logger = new Logger('HtmlReportsService');
  // constructor(private readonly conn: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }
}
