import { NgModule } from '@angular/core'; 
import { Http, RequestOptions } from '@angular/http'; 
import { AuthHttp, AuthConfig } from 'angular2-jwt'; 
 
export function authHttpServiceFactory(http: Http, options: RequestOptions) { 
   return new AuthHttp(new AuthConfig( 
     { 
      //  headerPrefix: "Bearer", 
      //  tokenGetter: (() => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyX3h4IiwiaWF0IjoxNDk1MjE2NjA2LCJleHAiOjE0OTU0NzU4MDZ9.mOX1l7WquXcWG_W0M_2LdYWjx3xPy0rnJWzRDl9GxR8'), 
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