import { Resultaat, ResultaatJson } from './resultaat.model';

interface MetingJson {
  id: number;
  resultaten: ResultaatJson[];
  created: string;
  user: string;
  metingResultaat: number;
}
export class Meting {
  private _id: number;
  constructor(
    private _resultaten = new Array<Resultaat>(), 
    private _dateAdded = new Date(),
    private _metingResultaat: number,
    private _user = ''
  ) {
    _resultaten = this.resultaten;
  }

  static fromJSON(json: MetingJson): Meting {
    const rec = new Meting(
      json.resultaten.map(Resultaat.fromJSON),
      new Date(json.created),
      json.metingResultaat,
      json.user
    );
    rec._id = json.id;
    return rec;
  }

  toJSON(): MetingJson {
    return <MetingJson>{
      resultaten: this.resultaten.map(ing => ing.toJSON()),
      created: this.dateAdded.toString(),
      metingResultaat: this.metingResultaat,
      user: this.user
    };
  }
  get id(): number {
    return this._id;
  }
  get resultaten(): Resultaat[] {
    return this._resultaten;
  }

  get dateAdded(): Date {
    return this._dateAdded;
  }

  get user(): string {
    return this._user;
  }

  get metingResultaat(): number {
    return this._metingResultaat;
  }
  addResultaat(type: string, amount?: number) {
    this._resultaten.push(new Resultaat(type, amount));
  }
}
