import puppeteer, { Browser } from 'puppeteer';

import { ICurrencyConverterProvider } from '../models/ICurrencyConverterProvider';

export class PuppeteerProvider implements ICurrencyConverterProvider {
  private fromSelector: string;
  private toSelector: string;
  private baseURL: string;

  constructor() {
    this.fromSelector = '.ZEB7Fb.vk_gy.vk_sh.Hg3mWc';
    this.toSelector = '.a61j6.vk_gy.vk_sh.Hg3mWc';
    this.baseURL = 'https://www.google.com/search?q=';
  }

  private async launch(): Promise<Browser> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    return browser;
  }

  private formatUrl({ from, to }: { from: string; to: string }): string {
    return `${this.baseURL}from+${from}+to+${to}`;
  }

  public async convert({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }): Promise<number> {
    const browser = await this.launch();

    try {
      const page = await browser.newPage();

      await page.goto(this.formatUrl({ from, to }));

      await page.waitForSelector(this.fromSelector);
      await page.$eval(this.fromSelector, element => {
        (element as HTMLInputElement).value = ''; // eslint-disable-line no-param-reassign
      });

      await page.type(this.fromSelector, `${amount}`);

      const result: number = await page.evaluate(
        browserToSelector => document.querySelector(browserToSelector).value,
        this.toSelector,
      );

      return result;
    } catch (error) {
      throw new Error();
    } finally {
      await browser.close();
    }
  }
}
