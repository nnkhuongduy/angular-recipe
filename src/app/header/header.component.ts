import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() selectedFeature = new EventEmitter<string>();

  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
  }

  onNavSelect(feature: string) {
    this.selectedFeature.emit(feature);
  }

  onSave() {
    this.dataStorageService.storeRecipes();
  }

  onFetch() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

}
