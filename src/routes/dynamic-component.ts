import {bindable, bindingMode} from 'aurelia-framework';

export class DynamicComponent {
    @bindable({defaultBindingMode: bindingMode.twoWay}) 
    grayed:boolean;

    @bindable({defaultBindingMode: bindingMode.twoWay}) 
    item:any;

    attached() {
        this.item.grayed = this.grayed;
    }

    grayedChanged(newValue){
        if(this.item){
            this.item.grayed = newValue;
            if(!newValue){
                this.item.answer = this.item.initial;
            }
        }
    }
}
