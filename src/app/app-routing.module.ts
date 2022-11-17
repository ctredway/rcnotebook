import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RolloutComponent } from './components/rollout/rollout.component';

const routes: Routes = [
  { path: '', component:HomepageComponent },
   { path: 'rollout',  component: RolloutComponent },
   { path: 'rollout/:tool',  component: RolloutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
