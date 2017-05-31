import { NgModule } from '@angular/core'; 
import { Http, RequestOptions } from '@angular/http'; 
import { AuthHttp, AuthConfig } from 'angular2-jwt'; 
 
export function authHttpServiceFactory(http: Http, options: RequestOptions) { 
   return new AuthHttp(new AuthConfig( 
     { 
        headerPrefix: "Bearer", 
        tokenGetter: (() => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyX3h4IiwiaWF0IjoxNDk2MjQ1NTUyLCJleHAiOjE1MDE0Mjk1NTJ9.A6plppWjgztJIgeWIEm_gBovN37znicrFv_S1qeij9Y'), 
      //  globalHeaders: [{ 'Content-Type': 'application/json' }] 
     } 
   ), http, options); 
 
} 
 
@NgModule({ 
  providers: [ 
    { 
      provide: AuthHttp, 
      useFactory: authHttpServiceFactory, 
      deps: [Http, RequestOptions] 
    } 
  ] 
}) 
export class AuthModule { }