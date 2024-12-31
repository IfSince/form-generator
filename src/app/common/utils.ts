import { Pipe, PipeTransform } from '@angular/core'

/**
 * Konvertiert technische Namen wie `firstName` in Labels wie `First Name`.
 */
export const formatLabel = (name: string): string => {
  const camelCaseSplit = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  const snakeCaseSplit = camelCaseSplit.replace(/_/g, ' ');

  return snakeCaseSplit
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

@Pipe({
  name: 'formatLabel',
  standalone: true
})
export class FormatLabelPipe implements PipeTransform {
  transform(text: string): string {
    return formatLabel(text);
  }
}
