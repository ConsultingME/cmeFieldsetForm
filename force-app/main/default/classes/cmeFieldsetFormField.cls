public with sharing class cmeFieldsetFormField {
    @AuraEnabled public Boolean required {get;set;} 
    @AuraEnabled public String apiName {get;set;} 

    public cmeFieldsetFormField(Schema.FieldSetMember fieldSetMember) {
        this.required = fieldSetMember.getDbRequired() || fieldSetMember.getRequired();
        this.apiName = fieldSetMember.getFieldPath();
    }

    public static List<cmeFieldsetFormField> getList(List<Schema.FieldSetMember> fieldSetMembers) {
        List<cmeFieldsetFormField> result = new List<cmeFieldsetFormField>();
        for (Schema.FieldSetMember fsm : fieldSetMembers) {
            result.add(new cmeFieldsetFormField(fsm));
        }
        return result;
    }
}