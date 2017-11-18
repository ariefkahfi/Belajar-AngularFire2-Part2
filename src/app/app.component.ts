import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  private listOfCinemas : Observable<any[]>;

  constructor(private af : AngularFireDatabase){}


  totalLikesOrDislikes(key : string){

  }

  addLikes(keyTitle : string){


    this.af.database.ref(`/cinemas/${keyTitle}/likes`)
      .transaction((data)=>{
          return data + 1;
      },(error,commited,dataSnaphot)=>{
          if(error){
            console.log(error);
          }else if (!commited){
            console.log('not comitted data');
          }else{

          }
      }).then((onFulfilled)=>{
          console.log('on fullfiled promise likes');

      });
  }



  setLikeAndDislike(key : string , data : any){
    this.af.object('/cinemas/'+key+"/likesOrDislikes")
      .set(data);
  }

  testLoadDataWithDoObs(){
    this.listOfCinemas = this.af.list('/cinemas',
      (ref)=>
          ref.orderByChild('/category').equalTo('cartoon')
      ) .snapshotChanges()
        .map((arrValue)=>(
          arrValue.map((mapVal)=>(
            {
              key : mapVal.key,
              category : mapVal.payload.child('/category').val(),
              age : mapVal.payload.child('/age').val(),
              likes : mapVal.payload.child('/likes').val(),
              dislikes : mapVal.payload.child('/dislikes').val(),
              likesOrDislikes : mapVal.payload.child('/likesOrDislikes').val()
            }
          ))
      )).do((x)=> {
          x.forEach((val,index)=>{
              let key = val.key;
              let likes = val.likes;
              let dislikes = val.dislikes;

              let datas = likes + dislikes;

              this.setLikeAndDislike(key,datas);
          });
      });

  }

  ngOnInit(): void {
    // this.loadData();
    this.testLoadDataWithDoObs();
  }



  dislikes(key:string) {
    this.af
      .database
      .ref(`/cinemas/${key}/dislikes`)
      .transaction((data)=>{
         return data + 1;
      },(error,commited,dataSnap)=>{
          if(error){
            console.log(error)
          }else if (!commited){
            console.log('data not commited');
          }else{
            // console.log('transaction success for dislike');
            // console.log('data : ' + dataSnap.val());
          }
      }).then((onFullfiled)=>{
            console.log('onFullfiled on dislike promise');
      });
  }
}
