public with sharing class cmeFieldsetFormController {

    @AuraEnabled(cacheable=true)
    public static cmeFieldsetFormConfig getFieldsetConfig(String sobjectType, String configName){
        try {
            //TODO: replace this w/ custom metadata
            cmeFieldsetFormConfig config = new cmeFieldsetFormConfig();
            config.criteriaField = 'Status_Pharming__c';
            config.valueToFieldsetNameMap = new Map<String, String>{
                'Pending' => 'Sample_Field_Set',
                'Submitted' => 'Sample_Field_Set_2'
            };

            Map<String, Schema.FieldSet> fieldsetMap = Schema.getGlobalDescribe().get(sobjectType).getDescribe().fieldSets.getMap();

            //TODO: move this into config class?
            config.valueToFieldsetMap = new Map<String, List<cmeFieldsetFormField>>();
            for(String val : config.valueToFieldsetNameMap.keyset()) {
                config.valueToFieldsetMap.put(val, cmeFieldsetFormField.getList(fieldsetMap.get(config.valueToFieldsetNameMap.get(val)).getFields()));
            }

            return config;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class cmeFieldsetFormConfig {
        @AuraEnabled public String criteriaField {get;set;}
        @AuraEnabled public Map<String, List<cmeFieldsetFormField>> valueToFieldsetMap {get;set;}
        public Map<String, String> valueToFieldsetNameMap {get;set;}
    }
}
