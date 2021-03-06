import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {IProfile} from '../Services/WebSocket/Models';
import {Observable} from 'rxjs/Rx';
import { HttpClientWraper } from './HttpClientWraper';

import { AppData } from '../Services/WebSocket/AppData';

@Injectable()
export class ProfileService{


constructor(
    private http: HttpClientWraper
    
) { 


}

    getProfile(): Observable<any>{
        return this.http.get('http://localhost:3002/api/profile')
            .map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    
    updateProfile(_Globals:AppData){
        return this.http.put('http://localhost:3002/api/profile',_Globals.Profile)
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    updateLiveStatus(IsLive:boolean):boolean{
        return !IsLive;
    }

    searchProfiles(name:String){
        return this.http.get('http://localhost:3002/api/profile/SearchProfile/ByName/'+name)
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    
}