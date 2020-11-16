import { v4 as uuidv4 } from 'uuid';

export class Coin {
  public readonly uid: string;

  public name: string;

  constructor(props: Omit<Coin, 'uid'>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.uid = uuidv4();
    }
  }
}
