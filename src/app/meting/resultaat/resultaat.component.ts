import { Component, OnInit, Input } from '@angular/core';
import { Resultaat } from '../resultaat.model';

@Component({
  selector: 'app-resultaat',
  templateUrl: './resultaat.component.html',
  styleUrls: ['./resultaat.component.css']
})
export class ResultaatComponent implements OnInit {
  @Input() resultaat: Resultaat;

  constructor() {}

  ngOnInit() {}
}
