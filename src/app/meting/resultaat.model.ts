export interface ResultaatJson {
  vraag: string;
  amount: number;
}
export class Resultaat {
  constructor(
    private _vraag: string,
    private _amount: number,
  ) {}

  static fromJSON(json: ResultaatJson): Resultaat {
    const amount =
      typeof json.amount === 'string' ? parseInt(json.amount) : json.amount;

    const ing = new Resultaat(json.vraag, amount);
    return ing;
  }

  toJSON(): ResultaatJson {
    return { 
      vraag: this.vraag, 
      amount: this.amount, 
    };
  }

  get vraag() {
    return this._vraag;
  }
  get amount() {
    return this._amount;
  }

}
