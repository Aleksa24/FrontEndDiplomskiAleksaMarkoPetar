import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../services/channel.service';
import {Channel} from '../../model/Channel';
import {Category} from '../../model/Category';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-make-channel',
  templateUrl: './make-channel.component.html',
  styleUrls: ['./make-channel.component.css']
})
export class MakeChannelComponent implements OnInit {

  public form: FormGroup;
  channels: Channel[];
  categories: Category[];

  constructor(private formBuilder: FormBuilder,
              private channelService: ChannelService,
              private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['']
    });

    this.channelService.getChannels().subscribe((value) => {
      this.channels = value;
    });
    this.categoryService.getCategories().subscribe((value) => {
      this.categories = value;
    });
  }

  makeChannel() {

  }
}
