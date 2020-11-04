import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BibleRangeComponent} from './bible-range/bible-range.component';
import {ParseComponent} from './parse/parse.component';
import {AboutComponent} from './about/about.component';

export const routes: Routes = [
  {path: '', component: BibleRangeComponent},
  {path: 'about', component: AboutComponent},
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
