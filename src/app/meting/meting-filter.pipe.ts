import { Pipe, PipeTransform } from '@angular/core';
import { Meting } from './meting.model';

@Pipe({
  name: 'metingFilter'
})
export class MetingFilterPipe implements PipeTransform {

  transform(metingen: Meting[], id: string): Meting[] {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    if (!id || id === "") {
      return metingen;
    }
    
    return metingen.filter(rec =>
      rec.dateAdded.toLocaleDateString('nl-BE', options).toLowerCase().includes(id.toLowerCase())
    );
  }
}
