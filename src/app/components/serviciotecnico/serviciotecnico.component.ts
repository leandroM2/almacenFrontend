import { Component, OnInit } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl: string;
}

@Component({
  selector: 'app-serviciotecnico',
  templateUrl: './serviciotecnico.component.html',
  styleUrls: ['./serviciotecnico.component.scss']
})
export class ServiciotecnicoComponent implements OnInit {

  teamMembers: TeamMember[] = [
    {
      name: "Farith Tamayo",
      role: "Ingeniero de Software",
      email: "farith.tamayo@gmail.com",
      phone: "900240818",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      name: "Leonardo Chaname",
      role: "Ingeniero de Software",
      email: "leonardo.chaname@gmail.com",
      phone: "991503575",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      name: "Leandro Mayuri",
      role: "Ingeniero de Software",
      email: "leandro.mayuri@gmail.com",
      phone: "948641200",
      imageUrl: "https://via.placeholder.com/100"
    }

  ];

  constructor() {

  }

  ngOnInit(): void {

  }

  onMouseOver(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
      if (member !== target) {
        member.classList.add('dimmed');
      }
    });
  }

  onMouseOut(event: MouseEvent): void {
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
      member.classList.remove('dimmed');
    });
  }


}
