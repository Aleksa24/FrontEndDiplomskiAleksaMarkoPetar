import { Component, OnInit } from '@angular/core';
import {ChannelService} from "../../services/channel.service";
import {ActivatedRoute} from "@angular/router";
import {Channel} from "../../model/Channel";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  idChannel: number;//ovo je privremeno
  channel$;


  constructor(private channelService: ChannelService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.channel$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get("id");
        this.idChannel = parseInt(id);
        console.log("upisan je id: " + id)
        return this.channelService.getById(parseInt(id));
      })
    );
  }

}
