import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Character, CharacterService } from '../character.service';

export interface Toggle {
  label: string;
  id: number;
}

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  providers: [CharacterService]
})
export class CharactersComponent implements OnInit {
  results$!: Observable<number>;
  searchText!: string;
  currentPage: number = 1;
  paginationState: boolean = true;
  activeToggle!: Toggle;
  charactersData: Array<Character> = [];
  toggles: Array<Toggle> = [
    { label: 'Постраничное переключение', id: 1},
    { label: 'Динамическая прокрутка', id: 2}
  ];
  visibileScroll: boolean = false;
  charactersArray: Array<Character> = [];
  isDisabled: boolean = false;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getData(this.currentPage).pipe(
      map(res => this.charactersData = this.charactersData.concat(res)),
      tap(res => this.charactersArray = res)
    ).subscribe();

    this.results$ = this.characterService.getData().pipe(
      map(el => el.count)
    );
  }

  getData(page: number) {
    return this.characterService.getCharacter(page)
  }

  onTableScroll(e: any) {
    const tableViewHeight = e.target.offsetHeight;
    const tableScrollHeight = e.target.scrollHeight;
    const scrollLocation = e.target.scrollTop;
    const limit = tableScrollHeight - tableViewHeight;    
    if (scrollLocation > limit) {
    this.currentPage++;
    this.getData(this.currentPage).pipe(
      map(res => this.charactersData = this.charactersData.concat(res)),
      tap(res => this.charactersArray = res)
    ).subscribe();
    } 
  }

  public onPreviousPage(): void {
    if(this.currentPage > 1) {
      this.currentPage--;
      this.getData(this.currentPage).pipe(
        map(res => this.charactersArray = res)
      ).subscribe();
    } else {
      this.isDisabled = true;
    }
  }

  public onNextPage(): void {
    if(this.currentPage < 9) {
      this.currentPage++;
      this.getData(this.currentPage).pipe(
        map(res => this.charactersArray = res)
      ).subscribe();
    } else {
      this.isDisabled = true;
    }
  }

  onClick(toggle: Toggle) {
    this.activeToggle = toggle;
    if(toggle.id === 2) {
      this.paginationState = false;
      this.visibileScroll = true;
      
    } else {
      this.paginationState = true;
      this.visibileScroll = false;
    }
    
  }

}
