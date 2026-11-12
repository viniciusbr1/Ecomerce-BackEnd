import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Banner } from "../banner/banner";

@Component({
  selector: 'app-home',
  imports: [Header, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
