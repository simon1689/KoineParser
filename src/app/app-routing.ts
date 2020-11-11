import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BibleRangeComponent} from './bible-range/bible-range.component';
import {ParseComponent} from './parse/parse.component';
import {AboutComponent} from './about/about.component';
import {ContactComponent} from './contact/contact.component';
import {MyScoresComponent} from './my-scores/my-scores.component';
import {ResourcesComponent} from './resources/resources.component';

export const routes: Routes = [
  {path: '', component: BibleRangeComponent},
  {path: 'resources', component: ResourcesComponent},
  {path: 'scores', component: MyScoresComponent},
  {path: 'about', component: AboutComponent},
  {path: 'parsing', component: ParseComponent},
  {path: 'bible', component: BibleRangeComponent},
  {path: 'contact', component: ContactComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule],
})

export class AppRoutingModule {
}
