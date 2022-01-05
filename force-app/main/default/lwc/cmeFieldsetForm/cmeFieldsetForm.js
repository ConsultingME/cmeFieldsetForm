import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getRecord } from "lightning/uiRecordApi";
import getAvailableRecordTypes from "@salesforce/apex/cmeFieldsetFormController.getAvailableRecordTypes";
import getFields from "@salesforce/apex/cmeFieldsetFormController.getFields";

/**
 * Fetches fields configured in a certain fieldset from the server and display them in an
 * edit form or a readonly form according to the configuration provided. When the form is
 * submitted, it redirects to the just create record edit detail page.
 * Fires formcancel event when user presses cancel button on edit form.
 *
 * @fires cmeFieldSetForm#formcancel
 */
class CmeFieldsetForm extends NavigationMixin(LightningElement) {
  /**
   * Indicates if the form field should be editable or not.
   * @type {boolean}
   */
  @api editMode = false;

  /**
   * Fieldset name
   * @type {string}
   */
  @api fieldSetName;

  /**
   * the record id user will edit or see
   * @type {string}
   */
  @api recordId;

  /**
   * the object type
   * @type {string}
   */
  @api sobjectType;

  fields = [];
  loading = false;
  recordTypeId;
  recordTypes = [];

  get displayRecordTypesSelector() {
    return !this.recordTypeId && this.recordTypes && this.recordTypes.length > 1;
  }

  get recordTypeIdFieldReference() {
    return this.sobjectType ? this.sobjectType + ".RecordTypeId" : undefined;
  }

  @wire(getFields, { sobjectType: "$sobjectType", fieldSetName: "$fieldSetName" })
  fieldsHandler({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.fields = data;
    }
  }

  @wire(getAvailableRecordTypes, { sobjectType: "$sobjectType" })
  recordTypesHandler({ data, error }) {
    if (data) {
      this.recordTypes = data;
      if (this.recordTypes.length === 1) {
        this.recordTypeId = this.recordTypes[0].value;
      }
    }
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$recordTypeIdFieldReference" })
  getRecord({ error, data }) {
    if (error) {
      console.log(error);
    } else if (data) {
      this.recordTypeId = data.fields["RecordTypeId"].value;
    }
  }

  handleCancel() {
    this.resetFields();
    this.editMode = false;
    this.dispatchEvent(new CustomEvent("formcancel"));
  }

  handleEdit() {
    this.editMode = true;
  }

  handleRecordTypeChange(event) {
    this.recordTypeId = event.detail.value;
  }

  handleFormError(event) {
    console.log(event.detail);
    console.log(event.output.fieldErrors);
  }

  handleFormSubmit() {
    this.loading = true;
  }

  handleFormSuccess(event) {
    this.loading = false;
    this.editMode = false;
    this.navigateToRecordViewPage(event.detail.id);
  }

  navigateToRecordViewPage(recordId) {
    // View a custom object record.
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        actionName: "view",
      },
    });
  }

  resetFields() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }
}

/**
 * Notifies the user has clicked the cancel button on the form.
 * Messages are broadcasted using Lightning Message Service.
 * The Messages channel is Pharming_Bus_Channel__c
 *
 * @event TodoList#formcancel
 */

export default CmeFieldsetForm;
