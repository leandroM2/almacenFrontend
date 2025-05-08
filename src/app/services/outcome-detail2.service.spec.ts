import { TestBed } from '@angular/core/testing';
import { OutcomeDService } from './outcome-d.service';

describe('OutcomeDService', () => {
    let service: OutcomeDService;

    beforeEach(()=>{
        TestBed.configureTestingModule({});
        service=TestBed.inject(OutcomeDService);
    });

    it('should be created',() =>{
        expect(service).toBeTruthy();
    });
});