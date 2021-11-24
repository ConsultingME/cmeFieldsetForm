import { LightningElement, api, wire } from 'lwc';
import getFields from '@salesforce/apex/cmeFieldsetFormController.getFields';

export default class CmeFieldsetForm extends LightningElement {
    @api fieldSetName;
    @api recordId;
    @api sobjectType;

    fields = [];

    @wire(getFields, { sobjectType: '$sobjectType', fieldSetName: '$fieldSetName' })
    getFields({error, data}) {
        if (error) {
            console.log(error);
        } else if (data) {
            this.fields = data;
        }
    }
}