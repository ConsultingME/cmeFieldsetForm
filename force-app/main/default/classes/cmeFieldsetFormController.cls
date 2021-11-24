public with sharing class cmeFieldsetFormController {
    @AuraEnabled(cacheable=true)
    public static List<cmeFieldsetFormField> getFields(String sobjectType, String fieldSetName){
        try {
            return cmeFieldsetFormField.getList(Schema.getGlobalDescribe().get(sobjectType).getDescribe().fieldSets.getMap().get(fieldSetName).getFields());

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
