import puppeteer, { Browser } from 'puppeteer';

import { IConvertCurrencyDTO } from '../dtos/IConvertCurrencyDTO';
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

  private formatUrl({ from, to }: Omit<IConvertCurrencyDTO, 'amount'>): string {
    return `${this.baseURL}from+${from}+to+${to}`;
  }

  private formatExceptions({
    from,
    to,
  }: Omit<IConvertCurrencyDTO, 'amount'>): Omit<IConvertCurrencyDTO, 'amount'> {
    let formattedFrom = from;
    let formattedTo = to;

    if (from === 'eth') {
      formattedFrom = 'ether' as 'eth';
    }

    if (from === 'eth') {
      formattedTo = 'ether' as 'eth';
    }

    return { from: formattedFrom, to: formattedTo };
  }

  public async convert({
    from: originalFrom,
    to: originalTo,
    amount,
  }: IConvertCurrencyDTO): Promise<number> {
    const browser = await this.launch();
    const { from, to } = this.formatExceptions({
      from: originalFrom,
      to: originalTo,
    });

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
