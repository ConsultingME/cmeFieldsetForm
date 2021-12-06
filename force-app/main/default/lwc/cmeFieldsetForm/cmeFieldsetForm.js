import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getFieldsetConfig from '@salesforce/apex/cmeFieldsetFormController.getFieldsetConfig';

export default class CmeFieldsetForm extends LightningElement {
    @api configName;
    @api recordId;
    @api sobjectType;

    get criteriaFieldReference() {
        return (this.sobjectType && this.criteriaField) ? [this.sobjectType + '.' + this.criteriaField] : undefined;
    }

    criteriaFieldValue;
    criteriaField;
    fields = [];

    @wire(getFieldsetConfig, { sobjectType: '$sobjectType', configName: '$configName' })
    getFields({error, data}) {
        if (error) {
            console.log(error);
        } else if (data) {
            this.config = data;
            this.criteriaField = data.criteriaField;
            this.trySetFields();
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: '$criteriaFieldReference' })
    getRecord({error, data}) {
        if (error) {
            console.log(error);
        } else if (data) {
            this.criteriaFieldValue = data.fields[this.criteriaField].value;
            this.trySetFields();
        }
    }

    trySetFields() {
        if (this.config.criteriaField && this.criteriaFieldValue) {
            this.fields = this.config.valueToFieldsetMap[this.criteriaFieldValue];
        }
    }
}