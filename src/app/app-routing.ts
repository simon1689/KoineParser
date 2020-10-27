import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BibleRangeComponent} from './bible-range/bible-range.component';
import {ParseComponent} from './parse/parse.component';

export const routes: Routes = [
  {path: '', component: BibleRangeComponent},
  {path: 'parsing', component: ParseComponent},
  {path: 'bible', component: BibleRangeComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
