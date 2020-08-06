import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentFactory, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from 'src/app/shared/alert/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  private closeSub: Subscription;
  private storeSub: Subscription;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  isSignIn = true;
  isLoading = false;
  error: string = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.storeSub.unsubscribe();
  }

  private showErrorAlert(message: string): void {
    const alertCmpFactory: ComponentFactory<AlertComponent> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef: ViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();

    const componentRef: ComponentRef<AlertComponent> = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.accept.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onSwitchMode(): void {
    this.isSignIn = !this.isSignIn;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    if (this.isSignIn) {
      this.store.dispatch(new AuthActions.SignInStart({ email, password }));
    } else {
      this.store.dispatch(new AuthActions.SignUpStart({ email, password }));
    }


    form.reset();
  }

  onErrorHandle(): void {
    this.store.dispatch(new AuthActions.ClearError());
  }

}
