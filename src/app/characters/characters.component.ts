import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, Observable, Subject, switchMap, tap } from 'rxjs';
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
export class CharactersComponent implements OnInit, AfterViewInit {
  @ViewChild('table', { read: ElementRef }) public tableRef!: ElementRef;
  results!: number;
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
  searchTerm$ = new Subject<string>();
  searchResults$!: Observable<any>;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getData(this.currentPage).pipe(
      map(res => this.charactersData = this.charactersData.concat(res)),
      tap(res => this.charactersArray = res)
    ).subscribe();
    this.characterService.getData().pipe(
      map(el => this.results = el.count)
    ).subscribe();
    this.searchTerm$.pipe(
      switchMap(searchTerm => this.characterService.getSearchedCharacter(searchTerm).pipe(
        tap(el => this.results = el.count),
        map(el => el.results)
        )
      ),
      tap(res => this.charactersArray = res)
    ).subscribe();
  }

  onSearchChange(searchChanged: string) {
    this.searchTerm$.next(searchChanged);
  }

  getData(page: number) {
    return this.characterService.getCharacter(page).pipe(map(el => el.results));
  }

  ngAfterViewInit(): void {
    fromEvent(this.tableRef.nativeElement, 'scroll')
      .pipe(debounceTime(500))
      .subscribe((e: any) => this.onTableScroll(e));
  }

  onTableScroll(e: any): void {
    const tableViewHeight = e.target.offsetHeight;
    const tableScrollHeight = e.target.scrollHeight;
    const scrollLocation = e.target.scrollTop;
    const buffer = 80;
    const limit = tableScrollHeight - tableViewHeight - buffer; 
       
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
    this.currentPage = 1;
    const stateData = this.getData(this.currentPage).pipe(
      map(res => this.charactersArray = res)
      ).subscribe();
    this.activeToggle = toggle;
    if(toggle.id === 2) {
      this.paginationState = false;
      this.visibileScroll = true;
      stateData;
    } else {
      this.paginationState = true;
      this.visibileScroll = false;
      stateData;
    }
    
  }

}
