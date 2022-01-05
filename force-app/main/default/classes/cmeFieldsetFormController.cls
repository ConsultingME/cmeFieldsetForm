public with sharing class cmeFieldsetFormController {
    
    @AuraEnabled(cacheable=true)
    public static List<cmeFieldsetFormField> getFields(String sobjectType, String fieldSetName){
        try {
            return cmeFieldsetFormField.getList(getDescribe(sobjectType).fieldSets.getMap().get(fieldSetName).getFields());
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<RecordTypeDTO> getAvailableRecordTypes(String sobjectType){
      List<RecordTypeDTO> recordTypes = new List<RecordTypeDTO>();
      for(RecordTypeInfo info: getDescribe(sobjectType).getRecordTypeInfos()) {
          if(info.isAvailable()) {
              recordTypes.add(new RecordTypeDTO(info.getRecordTypeId(), info.getName()));
          }
      }
  
      return recordTypes;
    }

    private static Schema.DescribeSObjectResult getDescribe(String sobjectType) {
        return Schema.getGlobalDescribe().get(sobjectType).getDescribe();
    }
  
    public class RecordTypeDTO {
      @AuraEnabled
      public Id value { get; set; }
  
      @AuraEnabled
      public String label { get; set; }
  
      public RecordTypeDTO(Id id, String name) {
        this.value = id;
        this.label = name;
      }
    }
}