import {Component} from "@angular/core";
import {NavController, Platform} from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarkerOptions,GoogleMapsMarker} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {RootObject} from '../../utilities/distanceResponse';

//const mapConfig: any;


@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private map: GoogleMap;
  //All marker instances for access
  public  DriverMarker : GoogleMapsMarker;
  private PassengerMarker : GoogleMapsMarker;
  private DestinationMarker : GoogleMapsMarker;

  private DriverDestinationDistance: number;
  private PassengerDestinationDistance: number;
  private DriverPassengerDistance: number;

  private DestinationCoordinates : string;
  private DriverCoordinates : string;
  private PassengerCoordinates : string;

  //To start calculating when all 3 marker is placed
  private calculateFlagCounter: number = 0;

  public showGreen: boolean = false;

  constructor(private _navController: NavController, private platform: Platform, private http:Http) {
    this.platform.ready().then(() => this.onPlatformReady());
  }


  private onPlatformReady(): void {
    this.map = new GoogleMap('map_canvas');

    GoogleMap.isAvailable().then(() => {
      this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
        //alert("GoogleMap.onMapReady(): " + JSON.stringify(data));
        let myPosition = new GoogleMapsLatLng(52.014490, 4.353549);
        console.log("My position is", myPosition);
        this.map.animateCamera({ target: myPosition, zoom: 15 });
      });
    });

  }

  private onMapReady(): void {
    alert('Map ready');
    //this.map.setOptions(mapConfig);
  }

  public addBtn(btnType: number): void{
    //Create if DestinationMarker didn't created before
    if(btnType == 1 && !this.DestinationMarker){

      //Create marker options
      var MarkerOptions :GoogleMapsMarkerOptions = {
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        title: "Destination",
        draggable: true,
        position: new GoogleMapsLatLng(52.013336, 4.353774)
      };

      //Assing self because of scooping stuff
      var self = this;

      //Add marker
      this.map.addMarker(MarkerOptions).then(function(marker) {
        marker.showInfoWindow(); // Success!

        //Adding marker is successfull - Increment counter
        self.calculateFlagCounter++;

        //Set marker to global variable for reuse
        self.DestinationMarker = marker;

        //Set markerDestination to global variable and check if
        //we can calculate (this marker may add at last)
        marker.getPosition().then(result => {
          self.DestinationCoordinates=result.toString();
          self.CalculateDistance();
        });

        //Add event listener
        marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((draggedMarker: GoogleMapsMarker) => {

            //Our marker is changed set it to global
            self.DestinationMarker = marker;
            marker.hideInfoWindow();
            //Dragging completed so calculate the distance
            marker.getPosition().then(result => {
              self.DestinationCoordinates=result.toString();
              self.CalculateDistance();
            });
        });
      }, function(reason) {
        console.log(reason); // Error!
      });
    }
    else if(btnType == 2 && !this.DriverMarker){
      var MarkerOptions :GoogleMapsMarkerOptions = {
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon15.png',
        title: "Driver",
        draggable: true,
        position: new GoogleMapsLatLng(52.017382, 4.352841)
      };
      var self = this;
      this.map.addMarker(MarkerOptions).then((marker) => {
        marker.showInfoWindow(); // Success!
        self.calculateFlagCounter++;
        self.DriverMarker = marker;
        marker.getPosition().then(result => {
          self.DriverCoordinates=result.toString();
          self.CalculateDistance();
        });
        marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((draggedMarker: GoogleMapsMarker) => {
            self.DriverMarker = marker;
            marker.hideInfoWindow();
            marker.getPosition().then(result => {
              self.DriverCoordinates=result.toString();
              self.CalculateDistance();
            });
        });
      }, function(reason) {
        console.log(reason); // Error!
      });
    }
    else if(btnType == 3 && !this.PassengerMarker){
      var MarkerOptions :GoogleMapsMarkerOptions = {
        icon: 'http://maps.google.com/mapfiles/kml/pal3/icon32.png',
        title: "Passenger",
        draggable: true,
        position: new GoogleMapsLatLng(52.016676, 4.356135)
      };
      var self = this;
      this.map.addMarker(MarkerOptions).then(function(marker) {
        marker.showInfoWindow(); // Success!
        self.calculateFlagCounter++;
        self.PassengerMarker = marker;
        marker.getPosition().then(result => {
          self.PassengerCoordinates=result.toString();
          self.CalculateDistance();
        });
        marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((draggedMarker: GoogleMapsMarker) => {
            self.PassengerMarker = marker;
            marker.hideInfoWindow();
            marker.getPosition().then(result => {
              self.PassengerCoordinates=result.toString();
              self.CalculateDistance();
            });
        });
      }, function(reason) {
        console.log(reason); // Error!
      });
    }
  }

  public CalculateDistance(){

    if(this.calculateFlagCounter == 3){

      var DriverDestinationURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +this.DriverCoordinates + "&destinations="+this.DestinationCoordinates +"&key=AIzaSyAbWqTb8OnFxVed_bm3C5Muh1qDufsOvis"
      var PassengerDestinationURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +this.PassengerCoordinates + "&destinations="+this.DestinationCoordinates +"&key=AIzaSyAbWqTb8OnFxVed_bm3C5Muh1qDufsOvis"
      var DriverPassengerURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +this.DriverCoordinates+ "&destinations="+  this.PassengerCoordinates+"&key=AIzaSyAbWqTb8OnFxVed_bm3C5Muh1qDufsOvis"

      this.http.get(DriverDestinationURL).toPromise()
      .then(res =>{
        this.DriverDestinationDistance = res.json().rows[0].elements[0].distance.value;
        console.log("DriverDestination ",this.DriverDestinationDistance);
        this.http.get(PassengerDestinationURL).toPromise()
        .then(res =>{
          this.PassengerDestinationDistance = res.json().rows[0].elements[0].distance.value;
          console.log("PassengerDestination ",this.PassengerDestinationDistance);
          this.http.get(DriverPassengerURL).toPromise()
          .then(res =>{
            this.DriverPassengerDistance = res.json().rows[0].elements[0].distance.value;
            console.log("DriverPassengerDistance " ,this.DriverPassengerDistance);
            //Start implementing formula
            this.calculateTheFormula();
          });
        });
      });
    }


  }

  public calculateTheFormula(){
    var left_side = (this.DriverPassengerDistance + this.DriverDestinationDistance)/3;
    var right_side = this.PassengerDestinationDistance / 3
    console.log(left_side, " will be compared ");
    console.log(right_side);
    if(left_side < right_side){
      this.showGreen = true;
    }
    else{
      this.showGreen = false;
    }
  }

  /*
    pushPage(){
      this._navController.push(SomeImportedPage, { userId: "12345"});
    }
  */
}




// {
//    "destination_addresses" : [ "29-60 Rue de Rivoli, 75004 Paris, Fransa" ],
//    "origin_addresses" : [ "Václavské nám. 55-57, 110 00 Praha 1, Çek Cumhuriyeti" ],
//    "rows" : [
//       {
//          "elements" : [
//             {
//                "distance" : {
//                   "text" : "1.031 km",
//                   "value" : 1030674
//                },
//                "duration" : {
//                   "text" : "9 saat 37 dakika",
//                   "value" : 34608
//                },
//                "status" : "OK"
//             }
//          ]
//       }
//    ],
//    "status" : "OK"
// }
