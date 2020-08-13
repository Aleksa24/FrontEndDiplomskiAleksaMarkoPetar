import { Component, OnInit } from '@angular/core';
import {Channel} from "../../model/Channel";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  channels: Channel[] = [];
  subs: Subscription[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
