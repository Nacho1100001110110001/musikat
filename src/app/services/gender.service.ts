import { Injectable } from '@angular/core';
import { gender } from '../../models/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  genders: gender[] = [{
    genderId: 1,
    name: "Rock latino",
    topSongs: null
  }]
  constructor() {
   }

  getGender(id: number): gender | null{
    let foundedGender = this.genders.find(gender => gender.genderId == id);
    if(foundedGender !== undefined) return foundedGender;
    return null;
  }
}
