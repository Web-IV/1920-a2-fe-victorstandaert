# Joy Meter

De Joy Meter is een webapplicatie waar u een meting kan afleggen die adhv een formule berekend hoe goed je je voelt en van waar die (negatieve) energie komt.

## Installation

Via [npm](https://www.npmjs.com/) worden de volgende packages geïnstalleerd:

chart.js voor de bar en line graph.
angular gauge-chart.
material voor angular

```bash
npm install chart.js --save
npm install angular-gauge-chart
npm install angular-material --save
```

## Usage

```typescript
import { GaugeChartModule } from 'angular-gauge-chart';
import { MatSliderModule } from '@angular/material/slider';

imports: [
    GaugeChartModule,
    MatSliderModule
  ],
```

Het project is op te starten met het commando:
```bash
npm start
```

Daarna kan u de site bezoeken op (http:localhost:4200)

## Backend

De repository voor de backend staat op: (https://github.com/Web-IV/1920-a2-be-victorstandaert)

## Users

Er zijn 2 gebruikers accounts al in de database:

student@hogent.be 
met wachtwoord: P@ssword1111

recipemaster@hogent.be
met wachtwoord: P@ssword1111


## Testing

De tests kunnen enkel gedaan worden op een nieuwe versie van de applicatie... wanneer er al metingen of accounts zijn toegevoegd werken ze niet meer.
Dit is omdat de tests zijn afgesteld op een versie van de app wanneer hij net is gecreeërd vanuit de backend.

